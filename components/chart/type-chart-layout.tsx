import { MTGCardTypes } from "@/constants/mtg/mtg-types";
import {
  groupCardsByColor,
  groupCardsByType,
} from "@/functions/card/card-grouping";
import { titleCase } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import { CardFilters } from "@/models/sorted-cards/sorted-cards";
import React from "react";
import { View } from "react-native";
import Text from "../ui/text/text";
import ChartCell, { getCellBackgroundColor } from "./chart-cell";
import ChartColumnHeading from "./chart-column-heading";

interface TypeChartLayoutProps {
  cards: Card[];
  filters: CardFilters;
  smallTitles?: boolean;
}

export default function TypeChartLayout({
  cards,
  filters,
  smallTitles = false,
}: TypeChartLayoutProps) {
  const colors = filters.colorFilter;

  const sortedCards = groupCardsByType(cards);
  const cardsSortedByColor = groupCardsByColor(cards);

  const sortedCreature = groupCardsByColor(sortedCards.creature);
  const sortedInstant = groupCardsByColor(sortedCards.instant);
  const sortedSorcery = groupCardsByColor(sortedCards.sorcery);
  const sortedArtifact = groupCardsByColor(sortedCards.artifact);
  const sortedEnchantment = groupCardsByColor(sortedCards.enchantment);
  const sortedLand = groupCardsByColor(sortedCards.land);
  const sortedPlans = groupCardsByColor(sortedCards.planeswalker);
  const sortedBattle = groupCardsByColor(sortedCards.battle);

  return (
    <>
      <View className="flex flex-row w-full -mt-1">
        <View className="w-24"></View>

        <ChartColumnHeading large smallTitles={smallTitles} title="Creature" />
        <ChartColumnHeading large smallTitles={smallTitles} title="Instant" />
        <ChartColumnHeading large smallTitles={smallTitles} title="Sorcery" />
        <ChartColumnHeading large smallTitles={smallTitles} title="Artifact" />
        <ChartColumnHeading
          large
          smallTitles={smallTitles}
          title="Enchantment"
        />
        <ChartColumnHeading large smallTitles={smallTitles} title="Land" />
        {sortedCards.planeswalker?.length > 0 && (
          <ChartColumnHeading
            large
            smallTitles={smallTitles}
            title="Planeswalker"
          />
        )}
        {sortedCards.battle?.length > 0 && (
          <ChartColumnHeading large smallTitles={smallTitles} title="Battle" />
        )}
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
            color={color}
            type={MTGCardTypes.CREATURE}
            sortedCards={sortedCreature}
          />
          <ChartCell
            color={color}
            type={MTGCardTypes.INSTANT}
            sortedCards={sortedInstant}
          />
          <ChartCell
            color={color}
            type={MTGCardTypes.SORCERY}
            sortedCards={sortedSorcery}
          />
          <ChartCell
            color={color}
            type={MTGCardTypes.ARTIFACT}
            sortedCards={sortedArtifact}
          />
          <ChartCell
            color={color}
            type={MTGCardTypes.ENCHANTMENT}
            sortedCards={sortedEnchantment}
          />
          <ChartCell
            color={color}
            type={MTGCardTypes.LAND}
            sortedCards={sortedLand}
          />
          {sortedCards.planeswalker?.length > 0 && (
            <ChartCell
              color={color}
              type={MTGCardTypes.PLANESWALKER}
              sortedCards={sortedPlans}
            />
          )}
          {sortedCards.battle?.length > 0 && (
            <ChartCell
              color={color}
              type={MTGCardTypes.BATTLE}
              sortedCards={sortedBattle}
            />
          )}

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
