import { Link, Stack } from "expo-router";
import React from "react";
import { Linking, Pressable, View, ViewProps } from "react-native";
import Tab, { TabProps } from "./tab";

export type TabBarProps = ViewProps & {
  tabs: TabProps[];
  hideBorder?: boolean;
};

export default function TabBar({
  tabs,
  hideBorder = false,
  className,
  children,
}: TabBarProps) {
  const [firstLoad, setFirstLoad] = React.useState(true);
  const [focusedIndex, setFocusedIndex] = React.useState(0);

  Linking.getInitialURL().then((url) => {
    if (!firstLoad || !tabs?.[0]?.link) return;

    tabs.forEach((tab, index) => {
      if (url?.includes(tab.name || "")) {
        setFirstLoad(false);
        setFocusedIndex(index);
      }
    });
  });

  return (
    <View className={`${className} flex mb-4`}>
      <View
        className={`flex flex-1 flex-row w-full min-h-[46px] max-h-[46px] -mb-[2px] pl-[2px] overflow-x-auto overflow-y-hidden ${
          hideBorder ? "border-b-2 border-background-200" : ""
        }`}
      >
        {tabs.map((tab, index) => (
          <View key={tab.title + index}>
            {tab.link ? (
              <Link
                href={tab.link}
                onPress={() => {
                  setFocusedIndex(index);
                }}
              >
                <Tab
                  {...tab}
                  index={index}
                  hideBorder={hideBorder}
                  focusedIndex={focusedIndex}
                  focused={index === focusedIndex}
                />
              </Link>
            ) : (
              <Pressable onPress={() => setFocusedIndex(index)}>
                <Tab
                  {...tab}
                  index={index}
                  hideBorder={hideBorder}
                  focusedIndex={focusedIndex}
                  focused={index === focusedIndex}
                />
              </Pressable>
            )}
          </View>
        ))}

        <View className="ml-auto">{children}</View>
      </View>

      {tabs?.[0]?.children ? (
        tabs[focusedIndex].children
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          {tabs.map((tab, index) => (
            <Stack.Screen key={tab.title + index} name={tab.link?.toString()} />
          ))}
        </Stack>
      )}
    </View>
  );
}
