import { BoardTypes } from "@/constants/boards";
import {
  groupCardsByCost,
  groupCardsByRarity,
  groupCardsByType,
} from "@/functions/card-grouping";
import {
  sortCardsAlphabetically,
  sortCardsByManaValue,
  sortCardsByPrice,
} from "@/functions/card-sorting";
import { titleCase } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";
import React, { useEffect } from "react";
import { View, ViewProps } from "react-native";
import Select from "../ui/input/select";
import DeckColumn from "./deck-column";

export type DeckCardGalleryViewType = "list" | "card";

export enum DeckCardGalleryViewTypes {
  LIST = "list",
  CARD = "card",
}

export type DeckCardGallerySortType = "name" | "mana-value" | "price";

export enum DeckCardGallerySortTypes {
  NAME = "name",
  MANA_VALUE = "mana-value",
  PRICE = "price",
}

export type DeckCardGalleryGroupType = "type" | "rarity" | "cost";

export enum DeckCardGalleryGroupTypes {
  TYPE = "type",
  RARITY = "rarity",
  COST = "cost",
}

export type DeckCardGalleryProps = ViewProps & {
  deck: Deck;
};

export default function DeckCardGallery({
  deck,
  className,
}: DeckCardGalleryProps) {
  const [viewType, setViewType] = React.useState(DeckCardGalleryViewTypes.LIST);
  const [sortType, setSortType] = React.useState(DeckCardGallerySortTypes.NAME);
  const [boardType, setBoardType] = React.useState(BoardTypes.MAIN);
  const [groupType, setGroupType] = React.useState(
    DeckCardGalleryGroupTypes.TYPE
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

    const sortedCards =
      sortType === DeckCardGallerySortTypes.MANA_VALUE
        ? sortCardsByManaValue(deck[boardType])
        : sortType === DeckCardGallerySortTypes.PRICE
        ? sortCardsByPrice(deck[boardType])
        : sortCardsAlphabetically(deck[boardType]);

    if (groupType === DeckCardGalleryGroupTypes.RARITY) {
      const rarityGroupedCards = groupCardsByRarity(sortedCards);

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
      const costGroupedCards = groupCardsByCost(sortedCards);

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
          ? [{ title: "Six +", cards: costGroupedCards.six }]
          : []),
      ]);
    } else {
      const typeGroupedCards = groupCardsByType(sortedCards);

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
  }, [boardCards, sortType, groupType, boardType]);

  return (
    <View className={`${className} flex gap-4`} style={{ zIndex: 10 }}>
      <View
        className="flex-1 flex flex-row flex-wrap gap-2"
        style={{ zIndex: 10 }}
      >
        <View
          className="flex-1 flex flex-row gap-2 min-w-fit"
          style={{ zIndex: 10 }}
        >
          <Select
            label="View"
            value={viewType}
            onChange={(type) => setViewType(type)}
            options={Object.keys(DeckCardGalleryViewTypes).map((key) => {
              return {
                label: titleCase(key),
                value: (DeckCardGalleryViewTypes as any)[key],
              };
            })}
          />

          <Select
            label="Sort"
            value={sortType}
            onChange={(type) => setSortType(type)}
            options={Object.values(DeckCardGallerySortTypes).map((key) => ({
              label: titleCase(key.replace("-", " ")),
              value: key,
            }))}
          />
        </View>

        <View
          className="flex-1 flex flex-row gap-2 min-w-fit"
          style={{ zIndex: 10 }}
        >
          <Select
            label="Grouping"
            value={groupType}
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
      </View>

      <View className="block w-full mt-2 lg:columns-3 md:columns-2 columns-1 gap-8">
        {groupedCards?.map(({ title, cards }) => (
          <DeckColumn
            key={title}
            title={title}
            viewType={viewType}
            cards={cards}
          />
        ))}
      </View>
    </View>
  );
}
