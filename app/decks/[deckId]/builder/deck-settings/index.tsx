import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import Select from "@/components/ui/input/select";
import Text from "@/components/ui/text/text";
import { BoardTypes } from "@/constants/boards";
import { MTGColorSymbols } from "@/constants/mtg/mtg-colors";
import { MTGFormat, MTGFormats } from "@/constants/mtg/mtg-format";
import { MTGCardTypes } from "@/constants/mtg/mtg-types";
import StoredCardsContext from "@/contexts/cards/stored-cards.context";
import DeckContext from "@/contexts/deck/deck.context";
import { getCardType } from "@/functions/cards/card-information";
import { getLocalStorageStoredCards } from "@/functions/local-storage/card-local-storage";
import { getLocalStorageDashboard } from "@/functions/local-storage/dashboard-local-storage";
import { mapCardsToDeckCard } from "@/functions/mapping/card-mapping";
import { getDeckColors, sortColors } from "@/functions/mtg-colors/mtg-colors";
import { titleCase } from "@/functions/text-manipulation";
import DeckService from "@/hooks/services/deck.service";
import { Card } from "@/models/card/card";
import { DeckDTO } from "@/models/deck/dtos/deck.dto";
import React, { useContext, useEffect } from "react";
import { Image, View } from "react-native";

export default function DeckSettingsPage() {
  const { deck, setDeck } = useContext(DeckContext);
  const { storedCards } = useContext(StoredCardsContext);

  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const [name, setName] = React.useState("");
  const [privateView, setPrivateView] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [format, setFormat] = React.useState(
    undefined as MTGFormat | undefined
  );
  const [commander, setCommander] = React.useState(null as Card | null);
  const [partner, setPartner] = React.useState(null as Card | null);

  const [featuredCardSearch, setFeaturedCardSearch] = React.useState("");
  const [featuredCard, setFeaturedCard] = React.useState(null as Card | null);

  const [commanderOptions, setCommanderOptions] = React.useState([] as Card[]);
  const [allowedPartner, setAllowedPartner] = React.useState(false);
  const [partnerOptions, setPartnerOptions] = React.useState([] as Card[]);

  const mainBoardCards = getLocalStorageStoredCards(BoardTypes.MAIN);

  useEffect(() => {
    if (!deck) return;

    setName(deck.name);
    setPrivateView(deck.private);
    setDescription(deck.description || "");
    setFormat(deck.format);

    const foundFeaturedCard = mainBoardCards.find(
      (card) =>
        card.imageURIs?.artCrop === deck.featuredArtUrl ||
        card.faces?.front.imageUris?.artCrop === deck.featuredArtUrl
    );
    if (foundFeaturedCard) {
      setFeaturedCard(foundFeaturedCard);
      setFeaturedCardSearch(foundFeaturedCard.name);
    }

    if (deck.commander) {
      setCommander(deck.commander);
      if (deck.partner) setPartner(deck.partner);

      const oracleText = deck.commander.oracleText;
      if (
        oracleText?.includes("Partner") ||
        oracleText?.includes("Choose a Background") ||
        oracleText?.includes("Friends forever")
      ) {
        setAllowedPartner(true);
      } else setAllowedPartner(false);
    }
  }, [deck]);

  useEffect(() => {
    if (!deck || !commander) return;

    let newCommander = false;
    let newPartner = false;

    if (deck.commander?.scryfallId !== commander.scryfallId) {
      newCommander = true;
      setPartner(null);
    }
    if (deck.partner?.scryfallId !== commander.scryfallId) {
      newPartner = true;
    }

    setDeck({
      ...deck,
      ...(newCommander && { commander, partner: undefined }),
      ...(!newCommander && newPartner && partner && { partner }),
    });

    const mainStoredCards = getLocalStorageStoredCards(BoardTypes.MAIN);

    const commanderOptions = mainStoredCards.filter(
      (card) =>
        card.typeLine.toLowerCase().includes("legendary") &&
        (getCardType(card) === MTGCardTypes.CREATURE ||
          card.oracleText?.includes("can be your commander"))
    );
    setCommanderOptions(commanderOptions);

    let commanderAllowsPartner = false;
    const commanderText = commander?.oracleText;
    if (
      commanderText?.includes("Partner") ||
      commanderText?.includes("Choose a Background") ||
      commanderText?.includes("Friends forever")
    ) {
      commanderAllowsPartner = true;
    } else commanderAllowsPartner = false;

    if (!commanderAllowsPartner) {
      setPartner(null);
      return;
    }

    const partnerOptions: Card[] = [];

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
        setPartner(foundPartner);
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
    } else if (commanderText?.includes("Choose a Background")) {
      partnerOptions.push(
        ...legendaries.filter((card) => card.typeLine.includes("Background"))
      );
    }

    setPartnerOptions(partnerOptions);
  }, [commander, partner, storedCards]);

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

  useEffect(() => {
    if (!deck || !format || format === deck?.format) return;

    setDeck({ ...deck, format: format });
  }, [format]);

  function saveDeck() {
    if (!deck) return;

    setSaving(true);

    const mainBoard = getLocalStorageStoredCards(BoardTypes.MAIN);
    const colorsInDeck = deck.commander
      ? [
          ...(deck.commander.colorIdentity?.length
            ? deck.commander.colorIdentity
            : [MTGColorSymbols.COLORLESS]),
          ...(deck.partner?.colorIdentity?.length
            ? deck.partner.colorIdentity
            : [MTGColorSymbols.COLORLESS]),
        ]
      : sortColors(getDeckColors(mainBoard));
    const deckColors = colorsInDeck?.length
      ? colorsInDeck
      : [MTGColorSymbols.COLORLESS];

    const dto: DeckDTO = {
      name,
      description,
      private: privateView,
      format,
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
      ],

      dashboard: getLocalStorageDashboard()?.sections || [],

      commanderId: commander?.scryfallId,
      partnerId: partner?.scryfallId,
    };

    DeckService.update(deck.id, dto).then(() => {
      setSaved(true);
      setSaving(false);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    });
  }

  return (
    <View className="flex gap-4">
      <BoxHeader
        title="Deck Settings"
        end={
          <Button
            disabled={saving}
            action={saved ? "success" : "primary"}
            text={saving ? "Saving..." : saved ? "Saved!" : "Save"}
            onClick={() => saveDeck()}
          />
        }
      />

      <View className="flex flex-row gap-6">
        <View className="w-64 h-[172px] bg-dark-100 rounded-xl overflow-hidden">
          {featuredCard && (
            <Image
              className="w-full h-full rounded-xl"
              source={{ uri: featuredCard.imageURIs?.artCrop }}
            />
          )}
        </View>

        <View className="flex-1 flex gap-4">
          <View className="flex flex-row flex-wrap gap-4">
            <Input
              label="Name"
              placeholder="Name"
              value={name}
              onChange={setName}
            />

            <View className="flex gap-2">
              <Text size="md" thickness="bold">
                Visibility
              </Text>

              <View className="flex flex-row -mt-[0.5px]">
                <Button
                  squareRight
                  text="Private"
                  action="primary"
                  className="flex-1"
                  type={privateView ? "default" : "outlined"}
                  onClick={() => setPrivateView(true)}
                />
                <Button
                  squareLeft
                  text="Public"
                  action="primary"
                  className="flex-1"
                  type={privateView ? "outlined" : "default"}
                  onClick={() => setPrivateView(false)}
                />
              </View>
            </View>
          </View>

          <View className="flex flex-row flex-wrap gap-4">
            <Input
              label="Featured Card"
              value={featuredCardSearch}
              onChange={setFeaturedCardSearch}
            />

            <View className="flex-[2] flex flex-row min-w-min">
              <Select
                label="Format"
                placeholder="Format"
                value={format}
                onChange={setFormat}
                squareRight={format === MTGFormats.COMMANDER}
                options={Object.values(MTGFormats).map((format) => ({
                  label: titleCase(format),
                  value: format,
                }))}
              />

              {format === MTGFormats.COMMANDER && (
                <>
                  <Select
                    squareLeft
                    squareRight={allowedPartner}
                    label="Commander"
                    value={commander}
                    property="scryfallId"
                    onChange={setCommander}
                    options={commanderOptions.map((option) => ({
                      label: option.name,
                      value: option,
                    }))}
                  />

                  {allowedPartner && (
                    <Select
                      squareLeft
                      label="Partner"
                      value={partner}
                      property="scryfallId"
                      onChange={setPartner}
                      options={partnerOptions.map((option) => ({
                        label: option.name,
                        value: option,
                      }))}
                    />
                  )}
                </>
              )}
            </View>
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
    </View>
  );
}
