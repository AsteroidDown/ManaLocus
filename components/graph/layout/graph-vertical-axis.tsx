import Text from "@/components/ui/text/text";
import { View, ViewProps } from "react-native";

export type GraphVerticalAxisProps = ViewProps & {
  title?: string;
  ceiling: number;
  tickLength: number;
};

export function GraphVerticalAxis({
  title,
  ceiling,
  tickLength,
  className,
}: GraphVerticalAxisProps) {
  const tickCount = ceiling / tickLength;

  const ticks = Array(tickCount + 1)
    .fill(0)
    .map((_tick, index) => index * tickLength);

  ticks.reverse();

  return (
    <View className={`${className} flex flex-row h-full`}>
      <View className="justify-center">
        <Text noWrap center className="md:-rotate-90">
          {title}
        </Text>
      </View>

      <View className="flex justify-between items-end">
        {ticks.map((tick, index) => (
          <Text
            noWrap
            center
            key={tick}
            className={`${
              index === 0 ? "-mt-2" : index === ticks.length - 1 ? "-mb-2" : ""
            } text-center`}
          >
            {tick}
          </Text>
        ))}
      </View>
    </View>
  );
}
