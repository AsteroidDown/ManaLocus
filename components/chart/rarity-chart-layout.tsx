import { MTGRarities } from "@/constants/mtg/mtg-rarity";
import {
  groupCardsByColor,
  groupCardsByRarity,
} from "@/functions/cards/card-grouping";
import { titleCase } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import { CardFilters } from "@/models/sorted-cards/sorted-cards";
import React from "react";
import { View } from "react-native";
import Text from "../ui/text/text";
import ChartCell, { getCellBackgroundColor } from "./chart-cell";
import ChartColumnHeading from "./chart-column-heading";

interface RarityChartLayoutProps {
  cards: Card[];
  filters: CardFilters;
  smallTitles?: boolean;
}

export default function RarityChartLayout({
  cards,
  filters,
  smallTitles = false,
}: RarityChartLayoutProps) {
  const colors = filters.colorFilter;

  const sortedCards = groupCardsByRarity(cards);
  const cardsSortedByColor = groupCardsByColor(cards);

  const sortedCommon = groupCardsByColor(sortedCards.common);
  const sortedUncommon = groupCardsByColor(sortedCards.uncommon);
  const sortedRare = groupCardsByColor(sortedCards.rare);
  const sortedMythic = groupCardsByColor(sortedCards.mythic);

  return (
    <>
      <View className="flex flex-row w-full -mt-1">
        <View className="w-24"></View>

        <ChartColumnHeading large smallTitles={smallTitles} title="Common" />
        <ChartColumnHeading large smallTitles={smallTitles} title="Uncommon" />
        <ChartColumnHeading large smallTitles={smallTitles} title="Rare" />
        <ChartColumnHeading large smallTitles={smallTitles} title="Mythic" />
        <ChartColumnHeading
          double
          large
          smallTitles={smallTitles}
          title="Total"
        />
      </View>

      {colors?.map((color, index) => (
        <View key={color + index} className="flex-1 flex flex-row">
          <View
            className={`flex flex-row justify-end items-center w-24 pr-2 border-t border-r border-background-300 ${getCellBackgroundColor(
              color
            )}`}
          >
            <Text thickness="semi">{titleCase(color)}</Text>
          </View>

          <ChartCell
            rarity={MTGRarities.COMMON}
            color={color}
            sortedCards={sortedCommon}
          />
          <ChartCell
            rarity={MTGRarities.UNCOMMON}
            color={color}
            sortedCards={sortedUncommon}
          />
          <ChartCell
            rarity={MTGRarities.RARE}
            color={color}
            sortedCards={sortedRare}
          />
          <ChartCell
            rarity={MTGRarities.MYTHIC}
            color={color}
            sortedCards={sortedMythic}
          />

          <ChartCell
            hideRightBorder
            color={color}
            sortedCards={cardsSortedByColor}
          />
        </View>
      ))}
    </>
  );
}
