import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import { MTGFormat } from "@/constants/mtg/mtg-format";
import { getLocalStorageStoredCards } from "@/functions/local-storage/card-local-storage";
import DeckService from "@/hooks/services/deck.service";
import { Card } from "@/models/card/card";
import { Deck, DeckDTO } from "@/models/deck/deck";
import React, { useEffect } from "react";
import { Image, View } from "react-native";

export default function DeckSettingsPage() {
  const [deck, setDeck] = React.useState(null as Deck | null);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [format, setFormat] = React.useState(null as MTGFormat | null);

  const [featuredCardSearch, setFeaturedCardSearch] = React.useState("");
  const [featuredCard, setFeaturedCard] = React.useState(null as Card | null);

  const mainBoardCards = getLocalStorageStoredCards("main");

  useEffect(() => {
    // if (deck) {
    //   return;
    // } else {
    //   if (mainBoardCards.length) {
    //     setFeaturedCard(mainBoardCards[0]);
    //     setFeaturedCardSearch(mainBoardCards[0].name);
    //   }
    //   setDeck({
    //     id: "1",
    //     userId: "1",
    //     name: "",
    //     featuredArtUrl: "",
    //     format: "standard",
    //     colors: [],
    //     mainBoard: [],
    //     sideBoard: [],
    //     maybeBoard: [],
    //     acquireBoard: [],
    //     created: new Date(),
    //     updated: new Date(),
    //   });
    // }
  });

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
    DeckService.update("7", dto).then((deck) => {
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

      <Input label="Name" placeholder="Name" onChange={setName} />

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

          <Input label="Format" placeholder="Format" onChange={setFormat} />
        </View>
      </View>
    </View>
  );
}
