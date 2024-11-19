import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import { MTGFormat } from "@/constants/mtg/mtg-format";
import { getLocalStorageStoredCards } from "@/functions/local-storage/card-local-storage";
import DeckService from "@/hooks/services/deck.service";
import { Card } from "@/models/card/card";
import { Deck, DeckDTO } from "@/models/deck/deck";
import { useGlobalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Image, View } from "react-native";

export default function DeckSettingsPage() {
  const { deckId } = useGlobalSearchParams();

  const [deck, setDeck] = React.useState(null as Deck | null);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [format, setFormat] = React.useState(null as MTGFormat | null);

  const [featuredCardSearch, setFeaturedCardSearch] = React.useState("");
  const [featuredCard, setFeaturedCard] = React.useState(null as Card | null);

  const mainBoardCards = getLocalStorageStoredCards("main");

  useEffect(() => {
    if (typeof deckId !== "string") return;

    DeckService.getById(deckId).then((deck) => setDeck(deck));
  }, [deckId]);

  useEffect(() => {
    if (!deck) return;

    setName(deck.name);
    // setDescription(deck.description);
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
    const dto: DeckDTO = {
      name,
      featuredArtUrl: featuredCard?.images?.artCrop,
      format: format || undefined,
      // mainBoard: mainBoardCards.map((card) => ({
      //   name: card.name,
      //   count: card.count,
      //   scryfallId: card.id,
      // })),
    };

    // if (!deck) {
    //   DeckService.create(dto).then((deck) => {
    //     console.log(deck);
    //   });
    // } else {

    if (typeof deckId !== "string") return;

    DeckService.update(deckId, dto).then((deck) => {
      console.log(deck);
    });
    // }
  }

  function getDeck() {
    DeckService.getById("7").then((deck) => {
      console.log(deck);
    });
  }

  return (
    <View className="flex gap-4">
      <BoxHeader
        title="Deck Settings"
        end={<Button text="Save" onClick={() => saveDeck()} />}
      />

      <Input label="Name" placeholder="Name" value={name} onChange={setName} />

      <Input
        label="Description"
        placeholder="Description"
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
