import { View } from "react-native";
import { MTGColor } from "../../../constants/colors";
import { Tooltip } from "../../ui/tooltip/tooltip";
import { BarData } from "./bar";

interface GroupedBarLayoutProps {
  data: BarData[];
  ceiling: number;
}

export function GroupedBarLayout({ data, ceiling }: GroupedBarLayoutProps) {
  const whiteHeight = getStackHeight("white", ceiling, data);
  const blueHeight = getStackHeight("blue", ceiling, data);
  const blackHeight = getStackHeight("black", ceiling, data);
  const redHeight = getStackHeight("red", ceiling, data);
  const greenHeight = getStackHeight("green", ceiling, data);
  const landHeight = getStackHeight("land", ceiling, data);
  const colorlessHeight = getStackHeight("colorless", ceiling, data);
  const goldHeight = getStackHeight("gold", ceiling, data);

  const baseClass = "w-10 h-full rounded-t-lg bg-gradient-to-t";

  return (
    <View className="flex flex-row gap-2 items-end h-56 border-white">
      <View className="flex h-full">
        <View style={[{ height: `${100 - whiteHeight}%` }]}></View>

        <Tooltip
          title={data.find((entry) => entry.color === "white")?.name}
          message={
            "Count: " +
            (data.find((entry) => entry.color === "white")?.count || 0)
          }
        >
          <View
            style={[{ height: `${whiteHeight}%` }]}
            className={`${baseClass} to-mtg-white from-mtg-white-secondary`}
          ></View>
        </Tooltip>
      </View>

      <View className="flex h-full">
        <View style={[{ height: `${100 - blueHeight}%` }]}></View>

        <Tooltip
          title={data.find((entry) => entry.color === "blue")?.name}
          message={
            "Count: " +
            (data.find((entry) => entry.color === "blue")?.count || 0)
          }
        >
          <View
            style={[{ height: `${blueHeight}%` }]}
            className={`${baseClass} to-mtg-blue from-mtg-blue-secondary`}
          ></View>
        </Tooltip>
      </View>

      <View className="flex h-full">
        <View style={[{ height: `${100 - blackHeight}%` }]}></View>

        <Tooltip
          title={data.find((entry) => entry.color === "black")?.name}
          message={
            "Count: " +
            (data.find((entry) => entry.color === "black")?.count || 0)
          }
        >
          <View
            style={[{ height: `${blackHeight}%` }]}
            className={`${baseClass} to-mtg-black from-mtg-black-secondary`}
          ></View>
        </Tooltip>
      </View>

      <View className="flex h-full">
        <View style={[{ height: `${100 - redHeight}%` }]}></View>

        <Tooltip
          title={data.find((entry) => entry.color === "red")?.name}
          message={
            "Count: " +
            (data.find((entry) => entry.color === "red")?.count || 0)
          }
        >
          <View
            style={[{ height: `${redHeight}%` }]}
            className={`${baseClass} to-mtg-red from-mtg-red-secondary`}
          ></View>
        </Tooltip>
      </View>

      <View className="flex h-full">
        <View style={[{ height: `${100 - greenHeight}%` }]}></View>

        <Tooltip
          title={data.find((entry) => entry.color === "green")?.name}
          message={
            "Count: " +
            (data.find((entry) => entry.color === "green")?.count || 0)
          }
        >
          <View
            style={[{ height: `${greenHeight}%` }]}
            className={`${baseClass} to-mtg-green from-mtg-green-secondary`}
          ></View>
        </Tooltip>
      </View>

      <View className="flex h-full">
        <View style={[{ height: `${100 - goldHeight}%` }]}></View>

        <Tooltip
          title={data.find((entry) => entry.color === "gold")?.name}
          message={
            "Count: " +
            (data.find((entry) => entry.color === "gold")?.count || 0)
          }
        >
          <View
            style={[{ height: `${goldHeight}%` }]}
            className={`${baseClass} to-mtg-gold from-mtg-gold-secondary`}
          ></View>
        </Tooltip>

        <View className="flex h-full">
          <View style={[{ height: `${100 - colorlessHeight}%` }]}></View>

          <Tooltip
            title={data.find((entry) => entry.color === "colorless")?.name}
            message={
              "Count: " +
              (data.find((entry) => entry.color === "colorless")?.count || 0)
            }
          >
            <View
              style={[{ height: `${colorlessHeight}%` }]}
              className={`${baseClass} to-mtg-colorless from-mtg-colorless-secondary`}
            ></View>
          </Tooltip>
        </View>

        <View className="flex h-full">
          <View style={[{ height: `${100 - landHeight}%` }]}></View>

          <Tooltip
            title={data.find((entry) => entry.color === "land")?.name}
            message={
              "Count: " +
              (data.find((entry) => entry.color === "land")?.count || 0)
            }
          >
            <View
              style={[{ height: `${landHeight}%` }]}
              className={`${baseClass} to-mtg-land from-mtg-land-secondary`}
            ></View>
          </Tooltip>
        </View>
      </View>
    </View>
  );
}

function getStackHeight(color: MTGColor, ceiling: number, data: BarData[]) {
  return (
    ((data.find((entry) => entry.color === color)?.count || 0) / ceiling) * 100
  );
}
