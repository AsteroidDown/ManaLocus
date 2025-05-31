import { BoardTypes } from "@/constants/boards";
import { BracketDetails } from "@/constants/mtg/brackets";
import { MTGFormats } from "@/constants/mtg/mtg-format";
import { SortTypes } from "@/constants/sorting";
import UserPreferencesContext from "@/contexts/user/user-preferences.context";
import {
  groupCardsByColor,
  groupCardsByCost,
  groupCardsByRarity,
  groupCardsByType,
  groupCardsCustom,
} from "@/functions/cards/card-grouping";
import {
  sortCardsAlphabetically,
  sortCardsByManaValue,
  sortCardsByPrice,
} from "@/functions/cards/card-sorting";
import { titleCase } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";
import {
  DeckCardGalleryGroupTypes,
  DeckCardGallerySortTypes,
  DeckCardGalleryViewTypes,
} from "@/models/deck/deck-gallery-filters";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect } from "react";
import { useWindowDimensions, View, ViewProps } from "react-native";
import Button from "../ui/button/button";
import Checkbox from "../ui/checkbox/checkbox";
import Select from "../ui/input/select";
import Text from "../ui/text/text";
import DeckColumn from "./deck-column";

export type DeckCardGalleryProps = ViewProps & {
  deck: Deck;
  bracket?: BracketDetails;
};

export default function DeckCardGallery({
  deck,
  bracket,
  className,
}: DeckCardGalleryProps) {
  const { preferences } = useContext(UserPreferencesContext);

  const width = useWindowDimensions().width;

  const [viewType, setViewType] = React.useState(
    preferences?.deckCardViewType ?? DeckCardGalleryViewTypes.LIST
  );
  const [groupType, setGroupType] = React.useState(
    preferences?.deckCardGrouping ?? DeckCardGalleryGroupTypes.TYPE
  );
  const [boardType, setBoardType] = React.useState(BoardTypes.MAIN);
  const [sortType, setSortType] = React.useState(
    preferences?.deckCardSortType ?? DeckCardGallerySortTypes.NAME
  );
  const [sortDirection, setSortDirection] = React.useState(
    preferences?.deckCardSortDirection ?? SortTypes.ASC
  );

  const [showManaValue, setShowManaValue] = React.useState(
    preferences?.deckCardColumnShowManaValue !== undefined
      ? preferences.deckCardColumnShowManaValue
      : true
  );
  const [showPrice, setShowPrice] = React.useState(
    preferences?.deckCardColumnShowPrice !== undefined
      ? preferences.deckCardColumnShowPrice
      : false
  );
  const [groupMulticolored, setGroupMulticolored] = React.useState(
    preferences?.deckCardColumnGroupMulticolored !== undefined
      ? preferences.deckCardColumnGroupMulticolored
      : false
  );

  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [overflow, setOverflow] = React.useState(false);

  const [boardCards, setBoardCards] = React.useState(
    {} as { [key: string]: Card[] }
  );

  const [groupedCards, setGroupedCards] = React.useState(
    [] as { title: string; cards: Card[] }[]
  );

  const [commander, setCommander] = React.useState(null as Card | null);
  const [partner, setPartner] = React.useState(null as Card | null);

  const [shouldWrap, setShouldWrap] = React.useState(false);

  useEffect(() => {
    if (!deck) return;

    const mainCards = deck.commander
      ? deck.main.filter(
          (card) =>
            card.scryfallId !== deck.commander?.scryfallId &&
            card.scryfallId !== deck.partner?.scryfallId
        )
      : deck.main;

    if (deck.commander) {
      setCommander(deck.commander);
      if (deck.partner) setPartner(deck.partner);
    }

    setBoardCards({
      main: sortCardsAlphabetically(mainCards),
      side: sortCardsAlphabetically(deck.side),
      maybe: sortCardsAlphabetically(deck.maybe),
      acquire: sortCardsAlphabetically(deck.acquire),
      trade: sortCardsAlphabetically(deck.trade),
    });

    setBoardType(BoardTypes.MAIN);
  }, [deck]);

  useEffect(() => {
    if (!deck) return;

    const ascending = sortDirection === SortTypes.ASC;

    const sortedCards =
      sortType === DeckCardGallerySortTypes.MANA_VALUE
        ? sortCardsByManaValue(boardCards[boardType], ascending)
        : sortType === DeckCardGallerySortTypes.PRICE
        ? sortCardsByPrice(boardCards[boardType], ascending)
        : sortCardsAlphabetically(boardCards[boardType], ascending);

    if (groupType === DeckCardGalleryGroupTypes.RARITY) {
      const rarityGroupedCards = groupCardsByRarity(sortedCards);

      setGroupedCards([
        ...(boardType === BoardTypes.MAIN && commander
          ? [
              {
                title:
                  deck.format === MTGFormats.OATHBREAKER
                    ? "Oathbreaker"
                    : "Commander",
                cards: [commander, ...(partner ? [partner] : [])],
              },
            ]
          : []),
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
    } else if (groupType === DeckCardGalleryGroupTypes.COLOR) {
      const colorGroupedCards = groupCardsByColor(sortedCards);

      setGroupedCards([
        ...(boardType === BoardTypes.MAIN && commander
          ? [
              {
                title:
                  deck.format === MTGFormats.OATHBREAKER
                    ? "Oathbreaker"
                    : "Commander",
                cards: [commander, ...(partner ? [partner] : [])],
              },
            ]
          : []),

        ...(colorGroupedCards.white?.length
          ? [{ title: "White", cards: colorGroupedCards.white }]
          : []),
        ...(colorGroupedCards.blue?.length
          ? [{ title: "Blue", cards: colorGroupedCards.blue }]
          : []),
        ...(colorGroupedCards.black?.length
          ? [{ title: "Black", cards: colorGroupedCards.black }]
          : []),
        ...(colorGroupedCards.red?.length
          ? [{ title: "Red", cards: colorGroupedCards.red }]
          : []),
        ...(colorGroupedCards.green?.length
          ? [{ title: "Green", cards: colorGroupedCards.green }]
          : []),
        ...(colorGroupedCards.gold?.length
          ? [{ title: "Gold", cards: colorGroupedCards.gold }]
          : []),
        ...(colorGroupedCards.colorless?.length
          ? [{ title: "Colorless", cards: colorGroupedCards.colorless }]
          : []),
        ...(colorGroupedCards.land?.length
          ? [{ title: "Land", cards: colorGroupedCards.land }]
          : []),
      ]);
    } else if (groupType === DeckCardGalleryGroupTypes.MANA_VALUE) {
      const costGroupedCards = groupCardsByCost(sortedCards);

      setGroupedCards([
        ...(boardType === BoardTypes.MAIN && commander
          ? [
              {
                title:
                  deck.format === MTGFormats.OATHBREAKER
                    ? "Oathbreaker"
                    : "Commander",
                cards: [commander, ...(partner ? [partner] : [])],
              },
            ]
          : []),

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
    } else if (groupType === DeckCardGalleryGroupTypes.CUSTOM) {
      const customGroupedCards = groupCardsCustom(sortedCards);

      const groups = Object.keys(customGroupedCards).map((group) => ({
        title: titleCase(group),
        cards: customGroupedCards[group],
      }));

      const customGroups = groups.filter((group) => group.title !== "Unsorted");
      const unsorted = groups.find((group) => group.title === "Unsorted");

      const typeGroupedCards = unsorted
        ? groupCardsByType(unsorted.cards)
        : ({} as any);

      setGroupedCards([
        ...(boardType === BoardTypes.MAIN && commander
          ? [
              {
                title:
                  deck.format === MTGFormats.OATHBREAKER
                    ? "Oathbreaker"
                    : "Commander",
                cards: [commander, ...(partner ? [partner] : [])],
              },
            ]
          : []),
        ...customGroups,
        ...(typeGroupedCards
          ? [
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
            ]
          : []),
      ]);
    } else {
      const typeGroupedCards = groupCardsByType(sortedCards);

      setGroupedCards([
        ...(boardType === BoardTypes.MAIN && commander
          ? [
              {
                title:
                  deck.format === MTGFormats.OATHBREAKER
                    ? "Oathbreaker"
                    : "Commander",
                cards: [commander, ...(partner ? [partner] : [])],
              },
            ]
          : []),
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
  }, [boardCards, sortType, sortDirection, groupType, boardType]);

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
        <View
          className="flex-1 flex flex-row flex-wrap gap-2"
          style={{ zIndex: 11 }}
        >
          <View className="lg:flex-[0] flex-1 z-[18] min-w-max">
            <Select
              label="View"
              value={viewType}
              className="lg:max-w-min"
              onChange={setViewType}
              options={Object.keys(DeckCardGalleryViewTypes).map((key) => {
                return {
                  label: titleCase(key),
                  value: (DeckCardGalleryViewTypes as any)[key],
                };
              })}
            />
          </View>

          {width > 600 && (
            <Select
              label="Grouping"
              value={groupType}
              className="lg:max-w-min"
              onChange={setGroupType}
              options={Object.keys(DeckCardGalleryGroupTypes).map((key) => {
                return {
                  label: titleCase(key.replace("_", " ")),
                  value: (DeckCardGalleryGroupTypes as any)[key],
                };
              })}
            />
          )}

          {width > 600 && (
            <Select
              label="Board"
              value={boardType}
              className="lg:max-w-min"
              onChange={setBoardType}
              options={
                deck.isCollection
                  ? [
                      {
                        label: "Main",
                        value: BoardTypes.MAIN,
                      },
                      {
                        label: "Trades",
                        value: "trade",
                      },
                      {
                        label: "Acquire",
                        value: BoardTypes.ACQUIRE,
                      },
                    ]
                  : Object.values(BoardTypes).map((board) => ({
                      label: titleCase(board),
                      value: board,
                    }))
              }
            />
          )}

          <Button
            size="sm"
            icon={faFilter}
            className="self-end"
            type={filtersOpen ? "default" : "outlined"}
            onClick={() => setFiltersOpen(!filtersOpen)}
          />
        </View>

        <View
          className={`${filtersOpen ? "max-h-[1000px]" : "max-h-0"} ${
            !overflow ? "overflow-hidden" : ""
          } flex flex-row flex-wrap lg:gap-0 gap-2 mr-auto transition-all duration-300`}
        >
          <View className="flex-1 z-[16] min-w-max">
            {width <= 600 && (
              <Select
                label="Grouping"
                value={groupType}
                className="lg:max-w-min"
                onChange={setGroupType}
                options={Object.keys(DeckCardGalleryGroupTypes).map((key) => {
                  return {
                    label: titleCase(key.replace("_", " ")),
                    value: (DeckCardGalleryGroupTypes as any)[key],
                  };
                })}
              />
            )}
          </View>

          <View className="flex-1 z-[14] min-w-max">
            {width <= 600 && (
              <Select
                label="Board"
                value={boardType}
                className="lg:max-w-min"
                onChange={setBoardType}
                options={
                  deck.isCollection
                    ? [
                        {
                          label: "Main",
                          value: BoardTypes.MAIN,
                        },
                        {
                          label: "Trades",
                          value: "trade",
                        },
                        {
                          label: "Acquire",
                          value: BoardTypes.ACQUIRE,
                        },
                      ]
                    : Object.values(BoardTypes).map((board) => ({
                        label: titleCase(board),
                        value: board,
                      }))
                }
              />
            )}
          </View>

          <View className="flex-1 z-[12] min-w-max">
            <Select
              squareRight={width > 600}
              label="Sort"
              value={sortType}
              className="lg:max-w-min"
              onChange={setSortType}
              options={Object.values(DeckCardGallerySortTypes).map((key) => ({
                label: titleCase(key.replace("-", " ")),
                value: key,
              }))}
            />
          </View>

          <View className="flex-1 z-[10] min-w-max">
            <Select
              squareLeft={width > 600}
              label="Direction"
              value={sortDirection}
              className="lg:mr-4 lg:max-w-min"
              onChange={setSortDirection}
              options={[
                { label: "Ascending", value: SortTypes.ASC },
                { label: "Descending", value: SortTypes.DESC },
              ]}
            />
          </View>

          <View className="flex-1 flex gap-3 max-h-fit min-w-fit">
            <Text size="sm" weight="medium">
              Column Options
            </Text>

            <View className="flex flex-row flex-wrap gap-4">
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

              <Checkbox
                label="Separate by Color"
                checked={groupMulticolored}
                onChange={setGroupMulticolored}
              />
            </View>
          </View>
        </View>
      </View>

      <View
        className={`${
          groupedCards.length > 2
            ? "lg:columns-3 md:columns-2 columns-1"
            : groupedCards.length === 2
            ? "lg:columns-2 columns-1"
            : "columns-1"
        } block w-full mt-2 gap-8`}
      >
        {groupedCards?.map(({ title, cards }, index) => (
          <DeckColumn
            key={title}
            cards={cards}
            title={title}
            bracket={bracket}
            format={deck.format}
            viewType={viewType}
            showPrice={showPrice}
            showManaValue={showManaValue}
            groupMulticolored={groupMulticolored}
            shouldWrap={shouldWrap && index === groupedCards.length - 1}
            commander={
              title === "Commander" || deck.format === MTGFormats.OATHBREAKER
            }
            colorIdentity={
              deck.commander
                ? [
                    ...deck.commander?.colorIdentity,
                    ...(deck.partner?.colorIdentity || []),
                  ]
                : undefined
            }
          />
        ))}
      </View>
    </View>
  );
}
