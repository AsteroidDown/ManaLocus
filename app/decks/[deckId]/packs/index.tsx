import { DeckCardGalleryViewTypes } from "@/components/decks/deck-card-gallery";
import DeckColumn from "@/components/decks/deck-column";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Divider from "@/components/ui/divider/divider";
import Input from "@/components/ui/input/input";
import NumberInput from "@/components/ui/input/number-input";
import { MTGRarities } from "@/constants/mtg/mtg-rarity";
import DeckContext from "@/contexts/deck/deck.context";
import { groupCardsByRarity } from "@/functions/cards/card-grouping";
import { Card } from "@/models/card/card";
import React, { useContext, useEffect } from "react";
import { ScrollView, View } from "react-native";

export interface Pack {
  name: string;
  cards: Card[];
}

export default function PackBuilderPage() {
  const { deck } = useContext(DeckContext);

  const [commonCount, setCommonCount] = React.useState(0);
  const [uncommonCount, setUncommonCount] = React.useState(0);
  const [rareCount, setRareCount] = React.useState(0);
  const [mythicCount, setMythicCount] = React.useState(0);
  const [totalCardCount, setTotalCardCount] = React.useState(0);

  const [cardsPerPack, setCardsPerPack] = React.useState(
    15 as number | undefined
  );
  const [playerCount, setPlayerCount] = React.useState(8 as number | undefined);
  const [packsPerPlayer, setPacksPerPlayer] = React.useState(3);
  const [basicLandSlot, setBasicLandSlot] = React.useState(false);

  const [commonsPerPack, setCommonsPerPack] = React.useState(
    undefined as number | undefined
  );
  const [uncommonsPerPack, setUncommonsPerPack] = React.useState(
    undefined as number | undefined
  );
  const [raresPerPack, setRaresPerPack] = React.useState(
    undefined as number | undefined
  );
  const [mythicsPerPack, setMythicsPerPack] = React.useState(
    undefined as number | undefined
  );

  const [packs, setPacks] = React.useState([] as Pack[]);

  useEffect(() => {
    if (!deck) return;

    let commons = 0;
    let uncommons = 0;
    let rares = 0;
    let mythics = 0;

    deck.main.forEach((card) => {
      if (card.rarity === MTGRarities.COMMON) commons += card.count;
      else if (card.rarity === MTGRarities.UNCOMMON) uncommons += card.count;
      else if (card.rarity === MTGRarities.RARE) rares += card.count;
      else if (card.rarity === MTGRarities.MYTHIC) mythics += card.count;
    });

    setCommonCount(commons);
    setUncommonCount(uncommons);
    setRareCount(rares);
    setMythicCount(mythics);

    setTotalCardCount(commons + uncommons + rares + mythics);
  }, [deck]);

  useEffect(() => {
    if (!totalCardCount) return;

    const packCount = (playerCount || 0) * (packsPerPlayer || 0);

    setCommonsPerPack(Math.floor(commonCount / packCount));
    setUncommonsPerPack(Math.floor(uncommonCount / packCount));
    setRaresPerPack(Math.floor((rareCount + mythicCount) / packCount));
  }, [totalCardCount]);

  function generatePacks() {
    if (!deck) return;

    const cardsByRarity = groupCardsByRarity(deck.main);

    const commons = cardsByRarity.common.reduce((acc, card) => {
      for (let i = 0; i < card.count; i++) acc.push({ ...card, count: 1 });
      return acc;
    }, [] as Card[]);

    const uncommons = cardsByRarity.uncommon.reduce((acc, card) => {
      for (let i = 0; i < card.count; i++) acc.push({ ...card, count: 1 });
      return acc;
    }, [] as Card[]);

    const rares = [
      ...cardsByRarity.rare.reduce((acc, card) => {
        for (let i = 0; i < card.count; i++) acc.push({ ...card, count: 1 });
        return acc;
      }, [] as Card[]),
      ...cardsByRarity.mythic.reduce((acc, card) => {
        for (let i = 0; i < card.count; i++) acc.push({ ...card, count: 1 });
        return acc;
      }, [] as Card[]),
    ];

    const packs: Pack[] = [];

    for (
      let pack = 0;
      pack < (playerCount || 0) * (packsPerPlayer || 0);
      pack++
    ) {
      const packCards: Card[] = [];

      // Get Commons for pack
      for (let common = 0; common < (commonsPerPack || 0); common++) {
        if (!commons?.length) break;

        const cardToPick = Math.floor(Math.random() * commons.length);
        packCards.push(commons.splice(cardToPick, 1)[0]);
      }

      // Get Uncommons for pack
      for (let uncommon = 0; uncommon < (uncommonsPerPack || 0); uncommon++) {
        if (!uncommons?.length) break;

        const cardToPick = Math.floor(Math.random() * uncommons.length);
        packCards.push(uncommons.splice(cardToPick, 1)[0]);
      }

      // Get Rares for pack
      for (let rare = 0; rare < (raresPerPack || 0); rare++) {
        if (!rares?.length) break;

        const cardToPick = Math.floor(Math.random() * rares.length);
        packCards.push(rares.splice(cardToPick, 1)[0]);
      }

      packs.push({
        name: `Pack ${pack + 1}`,
        cards: packCards,
      });
    }

    setPacks(packs);
  }

  if (!deck) return;

  return (
    <ScrollView className="bg-background-100">
      <View className="flex flex-1 gap-4 lg:px-16 px-4 py-8 min-h-[100vh] bg-background-100 bg-opacity-60 rounded-xl overflow-hidden">
        <BoxHeader
          title="Pack Builder"
          className="!pb-0"
          end={<Button text="Generate" onClick={() => generatePacks()} />}
        />

        <View className="flex flex-row gap-4">
          <NumberInput
            label="Cards per Pack"
            value={cardsPerPack}
            onChange={setCardsPerPack}
          />

          <NumberInput
            label="Player Count"
            value={playerCount}
            onChange={setPlayerCount}
          />

          <Input
            label="Common Land Slot"
            value={basicLandSlot ? "true" : "false"}
            onChange={() => setBasicLandSlot(!basicLandSlot)}
          />
        </View>

        <View className="flex flex-row gap-4">
          <NumberInput
            label="Max Commons Per Pack"
            placeholder={`Max: ${commonsPerPack}`}
            value={commonsPerPack}
            onChange={setCommonsPerPack}
          />

          <NumberInput
            label="Max Uncommons Per Pack"
            placeholder={`Max: ${uncommonsPerPack}`}
            value={uncommonsPerPack}
            onChange={setUncommonsPerPack}
          />

          <NumberInput
            label="Max Rares/Mythics Per Pack"
            placeholder={`Max: ${raresPerPack}`}
            value={raresPerPack}
            onChange={setRaresPerPack}
          />
        </View>

        <Divider thick className="!border-background-200" />

        <View className="block w-full mt-2 lg:columns-3 md:columns-2 columns-1 gap-8">
          {packs?.map((pack, index) => (
            <DeckColumn
              hideCount
              key={index}
              title={pack.name}
              cards={pack.cards}
              viewType={DeckCardGalleryViewTypes.LIST}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
