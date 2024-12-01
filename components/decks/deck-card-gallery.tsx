import { BoardTypes } from "@/constants/boards";
import {
  groupCardsByCost,
  groupCardsByRarity,
  groupCardsByType,
} from "@/functions/card-grouping";
import { sortCardsAlphabetically } from "@/functions/card-sorting";
import { titleCase } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";
import { Link } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import CardText from "../cards/card-text";
import Divider from "../ui/divider/divider";
import Select from "../ui/input/select";
import Text from "../ui/text/text";

export type DeckCardGalleryGroupType = "type" | "rarity" | "cost";

export enum DeckCardGalleryGroupTypes {
  TYPE = "type",
  RARITY = "rarity",
  COST = "cost",
}

export interface DeckCardGalleryProps {
  deck: Deck;
}

export default function DeckCardGallery({ deck }: DeckCardGalleryProps) {
  const [boardType, setBoardType] = React.useState(BoardTypes.MAIN);
  const [groupType, setGroupType] = React.useState(
    "cardType" as DeckCardGalleryGroupType
  );

  const [boardCards, setBoardCards] = React.useState(
    {} as { [key: string]: Card[] }
  );

  const [groupedCards, setGroupedCards] = React.useState(
    [] as { title: string; cards: Card[] }[]
  );

  useEffect(() => {
    if (!deck) return;

    setBoardCards({
      main: sortCardsAlphabetically(deck.main),
      side: sortCardsAlphabetically(deck.side),
      maybe: sortCardsAlphabetically(deck.maybe),
      acquire: sortCardsAlphabetically(deck.acquire),
    });

    setBoardType(BoardTypes.MAIN);
  }, [deck]);

  useEffect(() => {
    if (!deck) return;

    if (groupType === DeckCardGalleryGroupTypes.RARITY) {
      const rarityGroupedCards = groupCardsByRarity(deck[boardType]);

      setGroupedCards([
        ...(rarityGroupedCards.common?.length
          ? [{ title: "Common", cards: rarityGroupedCards.common }]
          : []),
        ...(rarityGroupedCards.uncommon?.length
          ? [{ title: "Uncommon", cards: rarityGroupedCards.uncommon }]
          : []),
        ...(rarityGroupedCards.rare?.length
          ? [{ title: "Rare", cards: rarityGroupedCards.rare }]
          : []),
        ...(rarityGroupedCards.mythic?.length
          ? [{ title: "Mythic", cards: rarityGroupedCards.mythic }]
          : []),
      ]);
    } else if (groupType === DeckCardGalleryGroupTypes.COST) {
      const costGroupedCards = groupCardsByCost(deck[boardType]);

      setGroupedCards([
        ...(costGroupedCards.zero?.length
          ? [{ title: "Zero", cards: costGroupedCards.zero }]
          : []),
        ...(costGroupedCards.one?.length
          ? [{ title: "One", cards: costGroupedCards.one }]
          : []),
        ...(costGroupedCards.two?.length
          ? [{ title: "Two", cards: costGroupedCards.two }]
          : []),
        ...(costGroupedCards.three?.length
          ? [{ title: "Three", cards: costGroupedCards.three }]
          : []),
        ...(costGroupedCards.four?.length
          ? [{ title: "Four", cards: costGroupedCards.four }]
          : []),
        ...(costGroupedCards.five?.length
          ? [{ title: "Five", cards: costGroupedCards.five }]
          : []),
        ...(costGroupedCards.six?.length
          ? [{ title: "Six", cards: costGroupedCards.six }]
          : []),
      ]);
    } else {
      const typeGroupedCards = groupCardsByType(deck[boardType]);

      setGroupedCards([
        ...(typeGroupedCards.creature?.length
          ? [{ title: "Creature", cards: typeGroupedCards.creature }]
          : []),
        ...(typeGroupedCards.instant?.length
          ? [{ title: "Instant", cards: typeGroupedCards.instant }]
          : []),
        ...(typeGroupedCards.sorcery?.length
          ? [{ title: "Sorcery", cards: typeGroupedCards.sorcery }]
          : []),
        ...(typeGroupedCards.artifact?.length
          ? [{ title: "Artifact", cards: typeGroupedCards.artifact }]
          : []),
        ...(typeGroupedCards.enchantment?.length
          ? [
              {
                title: "Enchantment",
                cards: typeGroupedCards.enchantment,
              },
            ]
          : []),
        ...(typeGroupedCards.planeswalker?.length
          ? [
              {
                title: "Planeswalker",
                cards: typeGroupedCards.planeswalker,
              },
            ]
          : []),
        ...(typeGroupedCards.battle?.length
          ? [{ title: "Battle", cards: typeGroupedCards.battle }]
          : []),
        ...(typeGroupedCards.land?.length
          ? [{ title: "Land", cards: typeGroupedCards.land }]
          : []),
      ]);
    }
  }, [boardCards, boardType, groupType]);

  return (
    <View className="flex gap-4" style={{ zIndex: 10 }}>
      <View className="flex flex-row gap-2" style={{ zIndex: 10 }}>
        <Select
          label="Grouping"
          value={DeckCardGalleryGroupTypes.TYPE}
          onChange={(type) => setGroupType(type)}
          options={Object.keys(DeckCardGalleryGroupTypes).map((key) => {
            return {
              label: titleCase(key),
              value: (DeckCardGalleryGroupTypes as any)[key],
            };
          })}
        />

        <Select
          label="Board"
          value={boardType}
          onChange={(board) => setBoardType(board)}
          options={Object.values(BoardTypes).map((board) => ({
            label: titleCase(board),
            value: board,
          }))}
        />
      </View>

      <View className="block w-full mt-2 lg:columns-3 md:columns-2 columns-1 gap-8">
        {groupedCards?.map(({ title, cards }) => (
          <Column key={title} title={title} cards={cards} />
        ))}
      </View>
    </View>
  );
}

function Column({ title, cards }: { title: string; cards?: Card[] }) {
  return (
    <View className="w-full break-inside-avoid mb-6">
      <View className="flex flex-row justify-between items-center px-2">
        <Text size="lg" thickness="bold">
          {titleCase(title)}
        </Text>

        <Text>{cards?.length}</Text>
      </View>

      <Divider thick className="!border-background-200 my-1" />

      <View className="flex gap-0.5">
        {cards?.map((card, index) => (
          <DeckCardHeader key={index} card={card} />
        ))}
      </View>
    </View>
  );
}

function DeckCardHeader({ card }: { card: Card }) {
  return (
    <Link
      href={`cards/${card.set}/${card.collectorNumber}`}
      className="flex flex-row gap-2 justify-between items-center px-2 py-0.5 rounded-full hover:bg-primary-200 transition-all duration-300"
    >
      <View className="flex-1 flex flex-row items-center gap-2">
        <Text>{card.count}</Text>
        <Text truncate thickness="medium">
          {card.name}
        </Text>
      </View>

      <CardText text={card.manaCost} />
    </Link>
  );
}
