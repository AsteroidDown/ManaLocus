import DeckKits from "@/components/decks/deck-kits";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Checkbox from "@/components/ui/checkbox/checkbox";
import Input from "@/components/ui/input/input";
import Select from "@/components/ui/input/select";
import Text from "@/components/ui/text/text";
import { BoardTypes } from "@/constants/boards";
import { MTGColorSymbols } from "@/constants/mtg/mtg-colors";
import { FormatsWithCommander, MTGFormats } from "@/constants/mtg/mtg-format";
import { MTGCardTypes } from "@/constants/mtg/mtg-types";
import StoredCardsContext from "@/contexts/cards/stored-cards.context";
import DeckContext from "@/contexts/deck/deck.context";
import ToastContext from "@/contexts/ui/toast.context";
import { getCardType } from "@/functions/cards/card-information";
import { getLocalStorageStoredCards } from "@/functions/local-storage/card-local-storage";
import { getLocalStorageDashboard } from "@/functions/local-storage/dashboard-local-storage";
import { getLocalStorageKits } from "@/functions/local-storage/kits-local-storage";
import { mapCardsToDeckCard } from "@/functions/mapping/card-mapping";
import { getDeckColors, sortColors } from "@/functions/mtg-colors/mtg-colors";
import { titleCase } from "@/functions/text-manipulation";
import DeckService from "@/hooks/services/deck.service";
import { Card } from "@/models/card/card";
import { DeckDTO } from "@/models/deck/dtos/deck.dto";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Image, SafeAreaView, useWindowDimensions, View } from "react-native";

export default function DeckSettingsPage() {
  const { addToast } = useContext(ToastContext);
  const { storedCards } = useContext(StoredCardsContext);
  const {
    deck,
    format,
    setFormat,
    commander,
    setCommander,
    partner,
    setPartner,
  } = useContext(DeckContext);

  const width = useWindowDimensions().width;

  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [privateView, setPrivateView] = useState(false);
  const [isKit, setIsKit] = useState(false);
  const [description, setDescription] = useState("");
  const [inProgress, setInProgress] = useState(false);

  const [featuredCardSearch, setFeaturedCardSearch] = useState("");
  const [featuredCard, setFeaturedCard] = useState(null as Card | null);

  const [commanderOptions, setCommanderOptions] = useState([] as Card[]);
  const [allowedPartner, setAllowedPartner] = useState(false);
  const [partnerOptions, setPartnerOptions] = useState([] as Card[]);

  const mainBoardCards = getLocalStorageStoredCards(BoardTypes.MAIN);

  const commanderFormat = FormatsWithCommander.includes(format as any);

  useEffect(() => {
    if (!deck) return;

    setName(deck.name);
    setPrivateView(deck.private);
    setDescription(deck.description || "");
    setFormat(deck.format);
    setIsKit(!!deck.isKit);
    setInProgress(!!deck.inProgress);

    const foundFeaturedCard = mainBoardCards.find(
      (card) =>
        card.imageURIs?.artCrop === deck.featuredArtUrl ||
        card.faces?.front.imageUris?.artCrop === deck.featuredArtUrl
    );
    if (foundFeaturedCard) {
      setFeaturedCard(foundFeaturedCard);
      setFeaturedCardSearch(foundFeaturedCard.name);
    }

    if (!commanderFormat) return;

    if (deck.commander) {
      setCommander(deck.commander);
      if (deck.partner) setPartner(deck.partner);

      const oracleText = deck.commander.oracleText;
      if (
        deck.format === MTGFormats.OATHBREAKER ||
        oracleText?.includes("Partner") ||
        oracleText?.includes("Choose a Background") ||
        oracleText?.includes("Friends forever") ||
        deck.commander.typeLine.includes("Time Lord Doctor")
      ) {
        setAllowedPartner(true);
      } else setAllowedPartner(false);
    }
  }, [deck]);

  useEffect(() => {
    if (!deck || !format || deck.format === format) return;

    setCommander(null);
    setPartner(null);
  }, [format]);

  useEffect(() => {
    if (!deck) return;

    if (!FormatsWithCommander.includes(format as any)) {
      setCommander(null);
      setPartner(null);
      setAllowedPartner(false);
      return;
    }
  }, [format, commander, partner, storedCards]);

  useEffect(() => {
    if (!FormatsWithCommander.includes(format as any)) return;

    const mainStoredCards = getLocalStorageStoredCards(BoardTypes.MAIN);

    const commanderOptions = mainStoredCards.filter((card) =>
      format === MTGFormats.OATHBREAKER
        ? getCardType(card) === MTGCardTypes.PLANESWALKER
        : card.typeLine.toLowerCase().includes("legendary") &&
          (getCardType(card) === MTGCardTypes.CREATURE ||
            card.oracleText?.includes("can be your commander"))
    );
    setCommanderOptions(commanderOptions);

    let commanderAllowsPartner = false;
    const commanderText = commander?.oracleText;
    if (format === MTGFormats.OATHBREAKER) {
      commanderAllowsPartner = true;
    } else if (
      commanderText?.includes("Partner") ||
      commanderText?.includes("Choose a Background") ||
      commanderText?.includes("Friends forever") ||
      commander?.typeLine.includes("Time Lord Doctor")
    ) {
      commanderAllowsPartner = true;
    } else commanderAllowsPartner = false;

    if (!commanderAllowsPartner) {
      setAllowedPartner(false);
      setPartner(null);
      return;
    } else setAllowedPartner(true);
  }, [format, commander]);

  useEffect(() => {
    if (!commander || !allowedPartner) return;

    const partnerOptions: Card[] = [];
    const commanderText = commander?.oracleText;

    const mainStoredCards = getLocalStorageStoredCards(BoardTypes.MAIN);

    if (format === MTGFormats.OATHBREAKER) {
      partnerOptions.push(
        ...mainStoredCards.filter(
          (card) =>
            card.typeLine.toLowerCase().includes("instant") ||
            card.typeLine.toLowerCase().includes("sorcery")
        )
      );
    } else {
      const legendaries = mainStoredCards
        .filter((card) => card.typeLine.toLowerCase().includes("legendary"))
        .filter((card) => card.scryfallId !== commander?.scryfallId);

      if (commanderText?.includes("Partner with")) {
        let partnerName = commanderText.split("Partner with")[1].split("\n")[0];
        if (partnerName.includes("(")) partnerName = partnerName.split(" (")[0];

        const foundPartner = legendaries.find(
          (card) =>
            card.name.toLowerCase().trim() === partnerName.toLowerCase().trim()
        );

        if (foundPartner && foundPartner.scryfallId !== partner?.scryfallId) {
          setTimeout(() => setPartner(foundPartner), 50);
          setPartnerOptions([foundPartner]);
          return;
        }
        return;
      } else if (commanderText?.includes("Partner")) {
        partnerOptions.push(
          ...legendaries.filter(
            (card) =>
              card.oracleText?.includes("Partner") &&
              !card.oracleText?.includes("Partner with")
          )
        );
      } else if (commanderText?.includes("Friends forever")) {
        partnerOptions.push(
          ...legendaries.filter((card) =>
            card.oracleText?.includes("Friends forever")
          )
        );
      } else if (commander?.typeLine.includes("Time Lord Doctor")) {
        partnerOptions.push(
          ...legendaries.filter((card) =>
            card.oracleText?.includes("Doctor's companion")
          )
        );
      } else if (commanderText?.includes("Choose a Background")) {
        partnerOptions.push(
          ...legendaries.filter((card) => card.typeLine.includes("Background"))
        );
      }
    }

    if (
      !partnerOptions
        .map((option) => option.scryfallId)
        .includes(partner?.scryfallId || "")
    ) {
      setPartner(null);
    }

    if (partnerOptions.length === 1) setPartner(partnerOptions[0]);

    setPartnerOptions(partnerOptions);
  }, [commander, allowedPartner]);

  useEffect(() => {
    if (!featuredCardSearch) return;

    const foundFeaturedCards: Card[] = [];

    mainBoardCards.forEach((card) => {
      if (card.name.toLowerCase().includes(featuredCardSearch.toLowerCase())) {
        foundFeaturedCards.push(card);
      }
    });

    if (
      foundFeaturedCards.length === 1 &&
      foundFeaturedCards[0].scryfallId !== featuredCard?.scryfallId
    ) {
      setFeaturedCardSearch(foundFeaturedCards[0].name);
      setFeaturedCard(foundFeaturedCards[0]);
    }
  }, [featuredCardSearch]);

  function saveDeck() {
    if (!deck) return;

    setSaving(true);

    const mainBoard = getLocalStorageStoredCards(BoardTypes.MAIN);
    const colorsInDeck = sortColors(
      commander
        ? [
            ...(commander.colorIdentity?.length
              ? commander.colorIdentity
              : [MTGColorSymbols.COLORLESS]),
            ...(deck.partner?.colorIdentity?.length
              ? deck.partner.colorIdentity
              : [MTGColorSymbols.COLORLESS]),
          ]
        : getDeckColors(mainBoard)
    );
    const deckColors = colorsInDeck?.length
      ? colorsInDeck
      : [MTGColorSymbols.COLORLESS];

    const dto: DeckDTO = {
      name,
      description,
      private: privateView,
      format: format ?? undefined,
      colors: `{${deckColors.join("}{")}}`,
      featuredArtUrl:
        featuredCard?.imageURIs?.artCrop ??
        featuredCard?.faces?.front.imageUris?.artCrop,

      cards: [
        ...mapCardsToDeckCard(mainBoard, BoardTypes.MAIN),
        ...mapCardsToDeckCard(
          getLocalStorageStoredCards(BoardTypes.SIDE),
          BoardTypes.SIDE
        ),
        ...mapCardsToDeckCard(
          getLocalStorageStoredCards(BoardTypes.MAYBE),
          BoardTypes.MAYBE
        ),
        ...mapCardsToDeckCard(
          getLocalStorageStoredCards(BoardTypes.ACQUIRE),
          BoardTypes.ACQUIRE
        ),
        ...mapCardsToDeckCard(getLocalStorageStoredCards("trade"), "trade"),
      ],

      dashboard: getLocalStorageDashboard()?.sections || [],

      commanderId: commander?.scryfallId,
      partnerId: partner?.scryfallId,

      isKit,
      inProgress,

      kits: getLocalStorageKits().map((kit) => kit.id),
    };

    DeckService.update(deck.id, dto)
      .then(() => {
        setSaving(false);

        addToast({
          action: "success",
          title: `${name ?? "Deck"} Saved!`,
          subtitle: `Your ${
            isKit ? "kit" : deck.isCollection ? "collection" : "deck"
          } has been saved`,
          content: (
            <Button
              size="xs"
              type="clear"
              text="View Deck"
              className="ml-auto"
              onClick={() => router.push(`decks/${deck.id}`)}
            />
          ),
        });
      })
      .catch();
  }

  return (
    <SafeAreaView className="flex-1 px-6 py-4 min-h-[100dvh] bg-background-100">
      <View className="flex gap-4">
        <BoxHeader
          title={deck?.isCollection ? "Collection Settings" : "Deck Settings"}
          end={
            <Button
              type="outlined"
              icon={faSave}
              disabled={saving}
              className="max-w-fit ml-auto"
              text={saving ? "Saving..." : "Save"}
              onClick={saveDeck}
            />
          }
        />

        <View className="flex lg:flex-row gap-6 z-10">
          <View className="w-64 h-[172px] lg:mx-0 mx-auto bg-dark-100 rounded-xl overflow-hidden">
            {featuredCard && (
              <Image
                className="w-full h-full rounded-xl"
                source={{ uri: featuredCard.imageURIs?.artCrop }}
              />
            )}
          </View>

          <View className="flex-1 flex gap-4">
            {width <= 600 && (
              <Input
                label="Name"
                placeholder="Name"
                value={name}
                onChange={setName}
              />
            )}

            <View className="flex flex-row flex-wrap gap-4">
              {width > 600 && (
                <Input
                  label="Name"
                  placeholder="Name"
                  value={name}
                  onChange={setName}
                />
              )}

              {width <= 600 && (
                <Input
                  label="Featured Card"
                  value={featuredCardSearch}
                  onChange={setFeaturedCardSearch}
                />
              )}

              <View className="flex gap-2">
                <Text weight="medium">Visibility</Text>

                <View className="flex flex-row -mt-[0.5px]">
                  <Button
                    size="sm"
                    squareRight
                    text="Public"
                    action="primary"
                    className="flex-1"
                    type={privateView ? "outlined" : "default"}
                    onClick={() => setPrivateView(false)}
                  />
                  <Button
                    size="sm"
                    squareLeft
                    text="Private"
                    action="primary"
                    className="flex-1"
                    type={privateView ? "default" : "outlined"}
                    onClick={() => setPrivateView(true)}
                  />
                </View>
              </View>

              {!deck?.isCollection && (
                <View className="flex gap-2">
                  <Text weight="medium">Type</Text>

                  <View className="flex flex-row -mt-[0.5px]">
                    <Button
                      size="sm"
                      squareRight
                      text="Deck"
                      action="primary"
                      className="flex-1"
                      type={isKit ? "outlined" : "default"}
                      onClick={() => setIsKit(false)}
                    />
                    <Button
                      size="sm"
                      squareLeft
                      text="Kit"
                      action="primary"
                      className="flex-1"
                      type={isKit ? "default" : "outlined"}
                      onClick={() => setIsKit(true)}
                    />
                  </View>
                </View>
              )}
            </View>

            <View className="flex flex-row flex-wrap gap-4">
              {width > 600 && (
                <Input
                  label="Featured Card"
                  value={featuredCardSearch}
                  onChange={setFeaturedCardSearch}
                />
              )}

              {!deck?.isCollection && (
                <View className="flex-[2] flex lg:flex-row lg:gap-0 gap-4 lg:min-w-min">
                  <Select
                    label="Format"
                    placeholder="Format"
                    value={format}
                    onChange={setFormat}
                    squareRight={width > 600 && !isKit && commanderFormat}
                    options={Object.values(MTGFormats).map((format) => ({
                      label: titleCase(format),
                      value: format,
                    }))}
                  />

                  {!isKit && commanderFormat && (
                    <>
                      <Select
                        squareLeft={width > 600}
                        squareRight={width > 600 && allowedPartner}
                        value={commander}
                        property="scryfallId"
                        onChange={setCommander}
                        label={
                          format === MTGFormats.OATHBREAKER
                            ? "Oathbreaker"
                            : "Commander"
                        }
                        options={commanderOptions.map((option) => ({
                          label: option.name,
                          value: option,
                        }))}
                      />

                      {allowedPartner && (
                        <Select
                          squareLeft={width > 600}
                          value={partner}
                          property="scryfallId"
                          onChange={setPartner}
                          label={
                            format === MTGFormats.OATHBREAKER
                              ? "Signature Spell"
                              : "Partner"
                          }
                          options={partnerOptions.map((option) => ({
                            label: option.name,
                            value: option,
                          }))}
                        />
                      )}
                    </>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>

        <Input
          multiline
          label="Description"
          placeholder="Description"
          value={description}
          onChange={setDescription}
        />

        {!deck?.isCollection && (
          <Checkbox
            label="In Progress"
            text="Decks in progress will not be visible to other users"
            checked={inProgress}
            onChange={setInProgress}
          />
        )}

        {deck && <DeckKits deck={deck} />}
      </View>
    </SafeAreaView>
  );
}
