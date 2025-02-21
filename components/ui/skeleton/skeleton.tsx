import { View, ViewProps } from "react-native";

export default function Skeleton({ className }: ViewProps) {
  return (
    <View className={`${className} bg-dark-200 rounded-lg animate-pulse`} />
  );
}
