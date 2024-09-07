import { Text, View } from "react-native";

export interface GraphVerticalAxisProps {
  ceiling: number;
  tickLength: number;
}

export function GraphVerticalAxis({
  ceiling,
  tickLength,
}: GraphVerticalAxisProps) {
  const tickCount = ceiling / tickLength;

  const ticks = Array(tickCount)
    .fill(0)
    .map((_tick, index) => index * tickLength);

  return (
    <View className="w-10">
      <Text className="absolute top-0 left-0 w-full text-center text-white text-nowrap translate-y-[-50%]">
        {ceiling}
      </Text>

      {ticks.map((tick) => (
        <Text
          key={tick}
          className="absolute right-0 w-full text-center text-white text-nowrap translate-y-[50%]"
          style={{
            bottom: `${(tick / ceiling) * 100}%`,
          }}
        >
          {tick}
        </Text>
      ))}
    </View>
  );
}
