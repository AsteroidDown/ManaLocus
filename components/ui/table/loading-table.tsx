import { View } from "react-native";
import Skeleton from "../skeleton/skeleton";
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
          row: () => <Skeleton className="px-2 py-3 w-16" />,
        },
        {
          row: (value) => (
            <Skeleton className="px-2 py-0.5 ">
              <Text>{Array(value).fill(" ").join(" ")}</Text>
            </Skeleton>
          ),
        },
        {
          row: (value, index) => (
            <Skeleton className="px-2 py-0.5 ">
              <Text>{Array(data2[index]).fill(" ").join(" ")}</Text>
            </Skeleton>
          ),
        },
        {
          fit: true,
          row: () => <Skeleton className="px-2 py-3 w-24" />,
        },
        {
          fit: true,
          row: () => (
            <View className="flex justify-center h-full pl-4 border-l border-background-200">
              <Skeleton className="px-2 py-3 w-8" />
            </View>
          ),
        },
      ]}
    />
  );
}
