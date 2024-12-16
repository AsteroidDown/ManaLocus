import { BoardTypes } from "@/constants/boards";
import { SortTypes } from "@/constants/sorting";
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
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import { View, ViewProps } from "react-native";
import Button from "../ui/button/button";
import Checkbox from "../ui/checkbox/checkbox";
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
  const [sortDirection, setSortDirection] = React.useState(SortTypes.ASC);
  const [boardType, setBoardType] = React.useState(BoardTypes.MAIN);
  const [groupType, setGroupType] = React.useState(
    DeckCardGalleryGroupTypes.TYPE
  );

  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [overflow, setOverflow] = React.useState(false);

  const [showManaValue, setShowManaValue] = React.useState(true);
  const [showPrice, setShowPrice] = React.useState(false);

  const [boardCards, setBoardCards] = React.useState(
    {} as { [key: string]: Card[] }
  );

  const [groupedCards, setGroupedCards] = React.useState(
    [] as { title: string; cards: Card[] }[]
  );

  const [commander, setCommander] = React.useState(null as Card | null);

  const [shouldWrap, setShouldWrap] = React.useState(false);

  useEffect(() => {
    if (!deck) return;

    const mainCards = deck.commander
      ? deck.main.filter(
          (card) => card.scryfallId !== deck.commander?.scryfallId
        )
      : deck.main;

    if (deck.commander) {
      setCommander(deck.commander);
    }

    setBoardCards({
      main: sortCardsAlphabetically(mainCards),
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
        ? sortCardsByManaValue(boardCards[boardType])
        : sortType === DeckCardGallerySortTypes.PRICE
        ? sortCardsByPrice(boardCards[boardType])
        : sortCardsAlphabetically(boardCards[boardType]);

    if (groupType === DeckCardGalleryGroupTypes.RARITY) {
      const rarityGroupedCards = groupCardsByRarity(sortedCards);

      setGroupedCards([
        ...(commander ? [{ title: "Commander", cards: [commander] }] : []),
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
        ...(commander ? [{ title: "Commander", cards: [commander] }] : []),

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
        ...(commander ? [{ title: "Commander", cards: [commander] }] : []),
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

  useEffect(() => {
    const first = groupedCards[0]?.cards.length;
    const sum = groupedCards.reduce(
      (acc, group) => acc + group.cards.length,
      0
    );

    if (first > sum - first) setShouldWrap(true);
    else setShouldWrap(false);
  }, [groupedCards]);

  useEffect(() => {
    if (filtersOpen) setTimeout(() => setOverflow(true), 300);
    else setOverflow(false);
  }, [filtersOpen]);

  return (
    <View className={`${className} flex gap-4`}>
      <View className="flex gap-2" style={{ zIndex: 10 }}>
        <View className="flex-1 flex flex-row flex-wrap gap-2">
          <Select
            label="View"
            value={viewType}
            className="max-w-min"
            onChange={(type) => setViewType(type)}
            options={Object.keys(DeckCardGalleryViewTypes).map((key) => {
              return {
                label: titleCase(key),
                value: (DeckCardGalleryViewTypes as any)[key],
              };
            })}
          />

          <Select
            label="Grouping"
            value={groupType}
            className="max-w-min"
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
            className="max-w-min"
            onChange={(board) => setBoardType(board)}
            options={Object.values(BoardTypes).map((board) => ({
              label: titleCase(board),
              value: board,
            }))}
          />

          <Button
            icon={faFilter}
            className="self-end"
            type={filtersOpen ? "default" : "outlined"}
            onClick={() => setFiltersOpen(!filtersOpen)}
          />
        </View>

        <View
          className={`${filtersOpen ? "max-h-[1000px]" : "max-h-0"} ${
            !overflow ? "overflow-hidden" : ""
          } flex flex-row mr-auto transition-all duration-300`}
        >
          <Select
            squareRight
            label="Sort"
            value={sortType}
            className="max-w-min"
            onChange={(type) => setSortType(type)}
            options={Object.values(DeckCardGallerySortTypes).map((key) => ({
              label: titleCase(key.replace("-", " ")),
              value: key,
            }))}
          />

          <Select
            squareLeft
            label="Direction"
            value={sortDirection}
            className="mr-4 max-w-min"
            onChange={(direction) => setSortDirection(direction)}
            options={[
              { label: "Ascending", value: SortTypes.ASC },
              { label: "Descending", value: SortTypes.DESC },
            ]}
          />

          <View className="flex flex-row gap-4 self-end mb-2">
            <Checkbox
              label="Price"
              checked={showPrice}
              onChange={setShowPrice}
            />

            <Checkbox
              label="Mana Value"
              checked={showManaValue}
              onChange={setShowManaValue}
            />
          </View>
        </View>
      </View>

      <View
        className={`${
          groupedCards.length > 2
            ? "lg:columns-3 md:columns-2 columns-1"
            : "columns-1"
        } block w-full mt-2 gap-8`}
      >
        {groupedCards?.map(({ title, cards }, index) => (
          <DeckColumn
            key={title}
            title={title}
            format={deck.format}
            viewType={viewType}
            showPrice={showPrice}
            showManaValue={showManaValue}
            commander={title === "Commander"}
            shouldWrap={shouldWrap && index === groupedCards.length - 1}
            cards={cards}
          />
        ))}
      </View>
    </View>
  );
}
