import Text from "@/components/ui/text/text";
import { Href } from "expo-router";
import React, { useRef } from "react";
import { View, ViewProps } from "react-native";

export type TabProps = ViewProps & {
  title: string;
  link?: Href;
  name?: string;
  index?: number;
  focused?: boolean;

  onClick?: () => void;
  setTabDetails?: (index: number, width: number, offset: number) => void;
};

export default function Tab({
  title,
  index,
  focused = false,
  className,
  setTabDetails,
}: TabProps) {
  const containerRef = useRef<View>(null);

  const baseClasses =
    "px-6 py-1.5 rounded-t-xl transition-all duration-300 hover:bg-primary-300 hover:bg-opacity-30";

  return (
    <View
      ref={containerRef}
      className={`${className} ${baseClasses}`}
      onLayout={() =>
        containerRef.current?.measureInWindow((x, _y, width) =>
          setTabDetails?.(index ?? 0, width, x)
        )
      }
    >
      <Text
        size="md"
        weight="semi"
        className={`${focused ? "!text-primary-200" : "!text-background-400"}`}
      >
        {title}
      </Text>
    </View>
  );
}
