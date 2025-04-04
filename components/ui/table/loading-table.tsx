import { View } from "react-native";
import Text from "../text/text";
import Table from "./table";

export default function LoadingTable() {
  const data = Array(10)
    .fill(undefined)
    .map(() => Math.floor(10 + Math.random() * 42));

  const data2 = Array(10)
    .fill(undefined)
    .map(() => Math.floor(10 + Math.random() * 21));

  return (
    <Table
      hideHeader
      data={data}
      columns={[
        {
          fit: true,
          row: () => (
            <View className="rounded-md px-2 py-3 bg-background-200 w-16 animate-pulse" />
          ),
        },
        {
          row: (value) => (
            <View className="rounded-md px-2 py-0.5 bg-background-200 animate-pulse">
              <Text>{Array(value).fill(" ").join(" ")}</Text>
            </View>
          ),
        },
        {
          row: (value, index) => (
            <View className="rounded-md px-2 py-0.5 bg-background-200 animate-pulse">
              <Text>{Array(data2[index]).fill(" ").join(" ")}</Text>
            </View>
          ),
        },
        {
          fit: true,
          row: () => (
            <View className="rounded-md px-2 py-3 bg-background-200 w-24 animate-pulse" />
          ),
        },
        {
          fit: true,
          row: () => (
            <View className="flex justify-center h-full pl-4 border-l border-background-200">
              <View className="rounded-md px-2 py-3 bg-background-200 w-8 animate-pulse" />
            </View>
          ),
        },
      ]}
    />
  );
}
