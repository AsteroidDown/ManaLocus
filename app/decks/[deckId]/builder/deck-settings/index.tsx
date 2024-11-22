import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import Text from "@/components/ui/text/text";
import { MTGFormat } from "@/constants/mtg/mtg-format";
import DeckContext from "@/contexts/deck/deck.context";
import { getLocalStorageStoredCards } from "@/functions/local-storage/card-local-storage";
import { mapCardToDeckCard } from "@/functions/mapping/card-mapping";
import { getDeckColors, sortColors } from "@/functions/mtg-colors/mtg-colors";
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
  const [format, setFormat] = React.useState(null as MTGFormat | null);

  const [featuredCardSearch, setFeaturedCardSearch] = React.useState("");
  const [featuredCard, setFeaturedCard] = React.useState(null as Card | null);

  const mainBoardCards = getLocalStorageStoredCards("main");

  useEffect(() => {
    if (!deck) return;

    setName(deck.name);
    setPrivateView(deck.private);
    setDescription(deck.description || "");
    setFormat(deck.format);

    const foundFeaturedCard = mainBoardCards.find(
      (card) =>
        card.images?.artCrop === deck.featuredArtUrl ||
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
      foundFeaturedCards[0].id !== featuredCard?.id
    ) {
      setFeaturedCardSearch(foundFeaturedCards[0].name);
      setFeaturedCard(foundFeaturedCards[0]);
    }
  }, [featuredCardSearch]);

  function saveDeck() {
    if (!deck) return;

    const mainBoard = getLocalStorageStoredCards("main");
    const deckColors = sortColors(getDeckColors(mainBoard));

    const dto: DeckDTO = {
      name,
      description,
      private: privateView,
      format: format || undefined,
      colors: `{${deckColors.join("}{")}}`,
      featuredArtUrl:
        featuredCard?.images?.artCrop ??
        featuredCard?.faces?.front.imageUris?.artCrop,

      mainBoard: mainBoard.map((card) => mapCardToDeckCard(card)),
      sideBoard: getLocalStorageStoredCards("side").map((card) =>
        mapCardToDeckCard(card)
      ),
      maybeBoard: getLocalStorageStoredCards("maybe").map((card) =>
        mapCardToDeckCard(card)
      ),
      acquireBoard: getLocalStorageStoredCards("acquire").map((card) =>
        mapCardToDeckCard(card)
      ),
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

      <Input
        label="Description"
        placeholder="Description"
        value={description}
        onChange={setDescription}
      />

      <View className="flex flex-row gap-6">
        <View className="w-64 h-[172px] bg-dark-100 rounded-xl overflow-hidden">
          {featuredCard && (
            <Image
              className="w-full h-full rounded-xl"
              source={{ uri: featuredCard.images?.artCrop }}
            />
          )}
        </View>

        <View className="flex-1 flex gap-4">
          <Input
            label="Featured Card"
            value={featuredCardSearch}
            onChange={setFeaturedCardSearch}
          />

          {/* <Input
            label="Format"
            placeholder="Format"
            value={format}
            onChange={setFormat}
          /> */}
        </View>
      </View>
    </View>
  );
}
