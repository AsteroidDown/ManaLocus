import React, { ReactNode } from "react";
import { View, ViewProps } from "react-native";
import DashboardItemHeader from "../dashboard/dashboard-item-header";
import { GraphHorizontalAxis } from "./layout/graph-horizontal-axis";
import { GraphPlot, SetData } from "./layout/graph-plot";
import { GraphVerticalAxis } from "./layout/graph-vertical-axis";

export type GraphProps = ViewProps & {
  id?: string;
  sectionId?: string;
  title: string;
  titleStart?: ReactNode;
  titleEnd?: ReactNode;
  readonly?: boolean;
  stacked?: boolean;
  horizontalTitle?: string;
  verticalTitle?: string;
  sets: SetData[];
};

export default function Graph({
  id,
  sectionId,
  title,
  titleStart,
  titleEnd,
  readonly,
  stacked,
  verticalTitle,
  horizontalTitle,
  className,
  sets,
}: GraphProps) {
  const maxValue = sets.reduce((acc, set) => {
    const setValue = stacked
      ? set.data.reduce(
          (acc, entry) =>
            acc + entry.cards.reduce((acc, card) => acc + card.count, 0),
          0
        )
      : set.data.reduce((acc, entry) => {
          const count = entry.cards.reduce((acc, card) => acc + card.count, 0);

          if (count > acc) return count;
          return acc;
        }, 0);

    if (setValue > acc) return setValue;
    return acc;
  }, 0);

  const ceiling =
    maxValue > 150
      ? Math.ceil(maxValue / 100) * 100
      : maxValue > 95
      ? Math.ceil(maxValue / 50) * 50
      : maxValue > 70
      ? Math.ceil(maxValue / 25) * 25
      : maxValue > 45
      ? Math.ceil(maxValue / 10) * 10
      : maxValue > 10
      ? Math.ceil(maxValue / 5) * 5
      : Math.ceil(maxValue / 2) * 2 + 2;

  const verticalTickLength =
    maxValue > 150
      ? 100
      : ceiling > 95
      ? 50
      : ceiling > 70
      ? 25
      : ceiling > 45
      ? 10
      : ceiling > 12
      ? 5
      : 2;

  return (
    <View className={`${className} flex flex-1 w-full h-full overflow-auto`}>
      <DashboardItemHeader
        readonly={readonly}
        hideDivider
        className="mb-4"
        itemId={id}
        sectionId={sectionId}
        title={title}
        titleStart={titleStart}
        titleEnd={titleEnd}
      />

      <View className="flex-1 flex flex-row">
        <GraphVerticalAxis
          className="w-3 mr-5"
          title={verticalTitle}
          ceiling={ceiling}
          tickLength={verticalTickLength}
        ></GraphVerticalAxis>

        <GraphPlot
          className="flex-[5]"
          sets={sets}
          ceiling={ceiling}
          stacked={stacked}
          yTickLength={verticalTickLength}
        ></GraphPlot>
      </View>

      <GraphHorizontalAxis
        sets={sets}
        title={horizontalTitle}
      ></GraphHorizontalAxis>
    </View>
  );
}
export { SetData };
