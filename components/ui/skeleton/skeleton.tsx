import { View, ViewProps } from "react-native";

export default function Skeleton({ className, children }: ViewProps) {
  return (
    <View
      style={{ backgroundSize: "200%" }}
      className={`${className} bg-gradient-to-r from-background-200 from-20% via-background-300 via-35% to-background-200 to-45% rounded-lg animate-[translate_2s_ease-in-out_infinite]`}
    >
      {children}
    </View>
  );
}
