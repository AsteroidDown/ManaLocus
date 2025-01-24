import { filterCards } from "@/functions/cards/card-filtering";
import {
  sortCardsAlphabetically,
  sortCardsByManaValue,
} from "@/functions/cards/card-sorting";
import { Card } from "@/models/card/card";
import { CardFilters } from "@/models/sorted-cards/sorted-cards";
import React, { ReactNode } from "react";
import { View, ViewProps } from "react-native";
import DashboardItemHeader from "../dashboard/dashboard-item-header";
import Placeholder from "../ui/placeholder/placeholder";
import CostChartLayout from "./cost-chart-layout";
import RarityChartLayout from "./rarity-chart-layout";
import TypeChartLayout from "./type-chart-layout";

export type ChartType = "cost" | "rarity" | "type";

export type ChartProps = ViewProps & {
  id: string;
  sectionId: string;
  cards: Card[];
  title: string;
  titleStart?: ReactNode;
  titleEnd?: ReactNode;
  type: ChartType;
  filters: CardFilters;
  smallTitles?: boolean;
  readonly?: boolean;
};

export default function Chart({
  id,
  sectionId,
  cards,
  title,
  titleStart,
  titleEnd,
  type,
  filters,
  smallTitles = false,
  readonly = false,
}: ChartProps) {
  let sortedCards = sortCardsByManaValue(sortCardsAlphabetically(cards));

  if (filters.rarityFilter?.length) {
    sortedCards = filterCards(sortedCards, {
      rarityFilter: filters.rarityFilter,
      typeFilter: filters.typeFilter,
    });
  }

  if (type === "cost")
    return (
      <View className="flex w-full h-full">
        <DashboardItemHeader
          className="my-2 px-4"
          itemId={id}
          sectionId={sectionId}
          title={title}
          titleEnd={titleEnd}
          titleStart={titleStart}
          readonly={readonly}
        />

        <CostChartLayout
          cards={sortedCards}
          filters={filters}
          smallTitles={smallTitles}
        />
      </View>
    );
  else if (type === "rarity")
    return (
      <View className="flex w-full h-full">
        <DashboardItemHeader
          className="my-2 px-4"
          itemId={id}
          sectionId={sectionId}
          title={title}
          titleEnd={titleEnd}
          titleStart={titleStart}
        />

        <RarityChartLayout
          cards={sortedCards}
          filters={filters}
          smallTitles={smallTitles}
        />
      </View>
    );
  else if (type === "type")
    return (
      <View className="flex w-full h-full">
        <DashboardItemHeader
          className="my-2 px-4"
          itemId={id}
          sectionId={sectionId}
          title={title}
          titleEnd={titleEnd}
          titleStart={titleStart}
        />

        <TypeChartLayout
          cards={sortedCards}
          filters={filters}
          smallTitles={smallTitles}
        />
      </View>
    );
  else return <Placeholder title="No Chart Found!" />;
}
