import Graph from "@/components/graph/graph";
import Box from "@/components/ui/box/box";
import Button from "@/components/ui/button/button";
import DashboardContext from "@/contexts/dashboard/dashboard.context";
import { filterCards } from "@/functions/card-filtering";
import {
  graphCardsByColor,
  graphCardsByCost,
  graphCardsByType,
} from "@/functions/card-graphing";
import {
  getLocalStorageDashboard,
  updateLocalStorageDashboardItem,
} from "@/functions/local-storage/dashboard-local-storage";
import { titleCase } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import { DashboardSection } from "@/models/dashboard/dashboard";
import { CardFilters } from "@/models/sorted-cards/sorted-cards";
import {
  faChartSimple,
  faDatabase,
  faInfoCircle,
  faPlus,
  faTextHeight,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect } from "react";
import { View, ViewProps } from "react-native";
import Chart, { ChartType } from "../chart/chart";
import Placeholder from "../ui/placeholder/placeholder";
import DashboardItemMenu from "./dashboard-item-menu";
import DashboardSectionHeader from "./dashboard-section-header";
import DashboardSectionOptionsMenu from "./dashboard-section-options-menu";

export type DashboardSectionProps = ViewProps & {
  sectionId: string;
  cards: Card[];

  readonly?: boolean;
  loadedSection?: DashboardSection;
};

export default function DashboardSectionView({
  sectionId,
  cards,

  readonly = false,
  loadedSection,
}: DashboardSectionProps) {
  const { dashboard, setDashboard } = useContext(DashboardContext);

  const [section, setSection] = React.useState(null as DashboardSection | null);

  const [addItemOpen, setAddItemOpen] = React.useState(false);

  const itemClasses =
    "flex-1 min-w-full h-80 !bg-background-100 border-2 border-background-300 overflow-x-scroll overflow-y-hidden transition-all duration-500";

  useEffect(
    () =>
      setSection(
        loadedSection ??
          (dashboard?.sections.find((section) => section.id === sectionId) ||
            null)
      ),
    [dashboard, sectionId]
  );

  function toggleStacked(itemId: string, stacked: boolean) {
    if (!section) return;

    if (loadedSection) {
      const itemIndex = loadedSection.items.findIndex(
        (item) => item.id === itemId
      );
      if (itemIndex >= 0) loadedSection.items[itemIndex].stacked = stacked;

      setSection({ ...loadedSection });
    } else {
      updateLocalStorageDashboardItem(itemId, section.id, { stacked });
      setDashboard(getLocalStorageDashboard());
    }
  }

  function setItemTitleSize(itemId: string, smallTitles: boolean) {
    if (!itemId || !sectionId) return;

    if (loadedSection) {
      const itemIndex = loadedSection.items.findIndex(
        (item) => item.id === itemId
      );
      if (itemIndex >= 0)
        loadedSection.items[itemIndex].smallTitles = smallTitles;

      setSection({ ...loadedSection });
    } else {
      updateLocalStorageDashboardItem(itemId, sectionId, { smallTitles });
      setDashboard(getLocalStorageDashboard());
    }
  }

  if (!section) return <Placeholder title="No Section Found!" />;

  return (
    <View className="flex gap-4 justify-center items-center w-full">
      <DashboardSectionHeader readonly={readonly} section={section} />

      <View className="flex flex-row flex-wrap gap-4 justify-start items-center w-full z-[-1]">
        {section.items.map((item, index) => (
          <Box
            key={item.title + index}
            className={`${itemClasses} ${
              item.itemType === "chart" ? "!p-0" : ""
            } ${
              item.size === "sm"
                ? "lg:min-w-[25%] lg:max-w-[33%]"
                : item.size === "md"
                ? "lg:min-w-[45%] lg:max-w-[66%]"
                : "lg:min-w-[100%]"
            }`}
          >
            {item.itemType === "graph" && (
              <Graph
                id={item.id}
                sectionId={section.id}
                title={item.title}
                stacked={item.stacked}
                readonly={readonly}
                horizontalTitle={titleCase(item.sortType)}
                sets={getSets(item.sortType, item.filters, cards)}
                titleStart={
                  <Button
                    rounded
                    type="clear"
                    action="default"
                    icon={item.stacked ? faDatabase : faChartSimple}
                    onClick={() => toggleStacked(item.id, !item.stacked)}
                  />
                }
                titleEnd={
                  readonly ? (
                    <View className="w-10 h-10" />
                  ) : (
                    <DashboardItemMenu
                      xOffset={-100}
                      item={item}
                      sectionId={section.id}
                    />
                  )
                }
              />
            )}

            {item.itemType === "chart" && (
              <Chart
                id={item.id}
                sectionId={section.id}
                cards={cards}
                title={item.title}
                type={item.sortType as ChartType}
                filters={item.filters}
                smallTitles={item.smallTitles}
                readonly={readonly}
                titleStart={
                  <Button
                    rounded
                    type="clear"
                    action="default"
                    icon={faTextHeight}
                    onClick={() => setItemTitleSize(item.id, !item.smallTitles)}
                  />
                }
                titleEnd={
                  readonly ? (
                    <View className="w-10 h-10" />
                  ) : (
                    <DashboardItemMenu
                      xOffset={-100}
                      item={item}
                      sectionId={section.id}
                    />
                  )
                }
              />
            )}
          </Box>
        ))}

        {!section.items.length && (
          <Placeholder
            title="No Items Added!"
            subtitle="Add some to get started"
            icon={faInfoCircle}
          >
            {!readonly && (
              <Button
                text="Add Item"
                className="mt-4"
                icon={faPlus}
                onClick={() => setAddItemOpen(true)}
              />
            )}

            <DashboardSectionOptionsMenu
              addOnly
              xOffset={-8}
              section={section}
              addItemOpen={addItemOpen}
              setAddItemOpen={setAddItemOpen}
            />
          </Placeholder>
        )}
      </View>
    </View>
  );
}

function getSets(type: string, filters: CardFilters, cards: Card[]) {
  if (type === "cost") {
    return graphCardsByCost(filterCards(cards, filters));
  } else if (type === "color") {
    return graphCardsByColor(filterCards(cards, filters));
  } else if (type === "type") {
    return graphCardsByType(filterCards(cards, filters));
  } else return [];
}
