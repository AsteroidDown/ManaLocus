import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode, useEffect } from "react";
import { Pressable, View, ViewProps } from "react-native";
import Button from "../button/button";
import Text from "../text/text";

export type DividerProps = ViewProps & {
  title: string;

  start?: ReactNode;
  end?: ReactNode;

  expanded?: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CollapsableSection({
  title,
  start,
  end,
  expanded,
  setExpanded,
  className,
  children,
}: DividerProps) {
  const [collapsed, setCollapsed] = React.useState(true);

  useEffect(() => {
    if (expanded) setCollapsed(false);
    else setTimeout(() => setCollapsed(!expanded), 150);
  }, [expanded]);

  return (
    <View className="flex w-full">
      <Pressable
        className="flex flex-row justify-between items-center gap-2 px-2 max-h-16 min-h-16 w-full overflow-hidden"
        onPress={() => setExpanded(!expanded)}
      >
        <View className="flex flex-row items-center gap-2 h-full">
          {start}

          <Text size="lg" weight="bold">
            {title}
          </Text>
        </View>

        <View className="flex flex-row items-center gap-2">
          {end}

          <Button
            rounded
            type="clear"
            action="default"
            icon={faChevronDown}
            className={`${
              expanded ? "rotate-180" : ""
            } transition-all duration-300`}
            onClick={() => setExpanded(!expanded)}
          />
        </View>
      </Pressable>

      <View
        className={`${expanded ? "max-h-[1000px]" : "max-h-0"} ${
          collapsed ? "!border-b-0 overflow-hidden" : ""
        } border-2 border-background-200 rounded-b-lg transition-all duration-300`}
      >
        <View className={`${className} flex gap-4 px-4 py-6`}>{children}</View>
      </View>
    </View>
  );
}
