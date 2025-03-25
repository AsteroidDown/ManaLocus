import { View, ViewProps } from "react-native";

export type DividerProps = ViewProps & {
  thick?: boolean;
  vertical?: boolean;
};

export default function Divider({
  className,
  thick = false,
  vertical = false,
}: DividerProps) {
  return (
    <View
      className={`
        ${className} border-background-200 ${
        vertical
          ? "  " + (thick ? "border-x" : "border-l")
          : " w-full " + (thick ? "border-y" : "border-b")
      }
      `}
    ></View>
  );
}
