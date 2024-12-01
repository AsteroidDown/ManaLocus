import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import Select from "@/components/ui/input/select";
import Text from "@/components/ui/text/text";
import { BoardTypes } from "@/constants/boards";
import { MTGColorSymbols } from "@/constants/mtg/mtg-colors";
import { MTGFormat, MTGFormats } from "@/constants/mtg/mtg-format";
import DeckContext from "@/contexts/deck/deck.context";
import { getLocalStorageStoredCards } from "@/functions/local-storage/card-local-storage";
import { mapCardsToDeckCard } from "@/functions/mapping/card-mapping";
import { getDeckColors, sortColors } from "@/functions/mtg-colors/mtg-colors";
import { titleCase } from "@/functions/text-manipulation";
import DeckService from "@/hooks/services/deck.service";
import { Card } from "@/models/card/card";
import { DeckDTO } from "@/models/deck/deck";
import React, { useContext, useEffect } from "react";
import { Image, View } from "react-native";

export default function DeckSettingsPage() {
  const { deck } = useContext(DeckContext);

  const [name, setName] = React.useState("");
  const [privateView, setPrivateView] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [format, setFormat] = React.useState(
    undefined as MTGFormat | undefined
  );

  const [featuredCardSearch, setFeaturedCardSearch] = React.useState("");
  const [featuredCard, setFeaturedCard] = React.useState(null as Card | null);

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
  }, [deck]);

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

    const mainBoard = getLocalStorageStoredCards(BoardTypes.MAIN);
    const colorsInDeck = sortColors(getDeckColors(mainBoard));
    const deckColors = colorsInDeck?.length
      ? sortColors(colorsInDeck)
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
    };

    DeckService.update(deck.id, dto);
  }

  return (
    <View className="flex gap-4">
      <BoxHeader
        title="Deck Settings"
        end={<Button text="Save" onClick={() => saveDeck()} />}
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

          <View className="flex flex-row gap-4">
            <Input
              label="Featured Card"
              value={featuredCardSearch}
              onChange={setFeaturedCardSearch}
            />

            <Select
              label="Format"
              placeholder="Format"
              value={format}
              onChange={setFormat}
              options={Object.values(MTGFormats).map((format) => ({
                label: titleCase(format),
                value: format,
              }))}
            />
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
