import {
  groupCardsByColor,
  groupCardsByCost,
} from "@/functions/card/card-grouping";
import { titleCase } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import { CardFilters } from "@/models/sorted-cards/sorted-cards";
import React from "react";
import { View } from "react-native";
import Text from "../ui/text/text";
import ChartCell, { getCellBackgroundColor } from "./chart-cell";
import ChartColumnHeading from "./chart-column-heading";

interface CostChartLayoutProps {
  cards: Card[];
  filters: CardFilters;
  smallTitles?: boolean;
}

export default function CostChartLayout({
  cards,
  filters,
  smallTitles = false,
}: CostChartLayoutProps) {
  const colors = filters.colorFilter;

  const sortedCards = groupCardsByCost(cards);
  const cardsSortedByColor = groupCardsByColor(cards);

  const sortedZero = groupCardsByColor(sortedCards.zero);
  const sortedOne = groupCardsByColor(sortedCards.one);
  const sortedTwo = groupCardsByColor(sortedCards.two);
  const sortedThree = groupCardsByColor(sortedCards.three);
  const sortedFour = groupCardsByColor(sortedCards.four);
  const sortedFive = groupCardsByColor(sortedCards.five);
  const sortedSix = groupCardsByColor(sortedCards.six);

  return (
    <>
      <View className="flex flex-row w-full -mt-1">
        <View className="w-24"></View>

        {sortedCards.zero.length > 0 && (
          <ChartColumnHeading
            smallTitles={smallTitles}
            title={smallTitles ? "0" : "Zero"}
          />
        )}
        <ChartColumnHeading
          smallTitles={smallTitles}
          title={smallTitles ? "1" : "One"}
        />
        <ChartColumnHeading
          smallTitles={smallTitles}
          title={smallTitles ? "2" : "Two"}
        />
        <ChartColumnHeading
          smallTitles={smallTitles}
          title={smallTitles ? "3" : "Three"}
        />
        <ChartColumnHeading
          smallTitles={smallTitles}
          title={smallTitles ? "4" : "Four"}
        />
        <ChartColumnHeading
          smallTitles={smallTitles}
          title={smallTitles ? "5" : "Five"}
        />
        {sortedCards.six.length > 0 && (
          <ChartColumnHeading
            smallTitles={smallTitles}
            title={smallTitles ? "6+" : "Six +"}
          />
        )}
        <ChartColumnHeading smallTitles={smallTitles} double title="Total" />
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

          {sortedCards.zero.length > 0 && (
            <ChartCell cost={0} color={color} sortedCards={sortedZero} />
          )}
          <ChartCell cost={1} color={color} sortedCards={sortedOne} />
          <ChartCell cost={2} color={color} sortedCards={sortedTwo} />
          <ChartCell cost={3} color={color} sortedCards={sortedThree} />
          <ChartCell cost={4} color={color} sortedCards={sortedFour} />
          <ChartCell cost={5} color={color} sortedCards={sortedFive} />
          {sortedCards.six?.length > 0 && (
            <ChartCell cost={6} color={color} sortedCards={sortedSix} />
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
