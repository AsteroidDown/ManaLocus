import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link, router, Stack } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, useWindowDimensions, View, ViewProps } from "react-native";
import Box from "../box/box";
import Button from "../button/button";
import Dropdown from "../dropdown/dropdown";
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
  const width = useWindowDimensions().width;

  const [firstLoad, setFirstLoad] = React.useState(true);
  const [focusedIndex, setFocusedIndex] = React.useState(0);

  const [expanded, setExpanded] = React.useState(false);

  useEffect(() => {
    if (!tabs?.[0]?.link) return;
    let tabIndex = 0;

    tabs.forEach((tab, index) => {
      if (focusedIndex === index || tabIndex === index) return;

      if (window.location.href?.includes(tab.link?.toString() || "")) {
        tabIndex = index;
      }
    });

    if (firstLoad && tabIndex !== focusedIndex) {
      setFocusedIndex(tabIndex);
      setFirstLoad(false);
    }
  });

  return (
    <View className={`${className} flex-1 flex`}>
      <View
        className={`flex flex-1 flex-row w-full min-h-[46px] max-h-[46px] -mb-[2px] overflow-x-auto overflow-y-hidden ${
          hideBorder ? "!mb-[2px] border-b-2 border-background-200" : "pl-[2px]"
        }`}
      >
        {width > 600 &&
          tabs.map((tab, index) => (
            <View key={tab.title + index}>
              {tab.link ? (
                <Link href={tab.link} onPress={() => setFocusedIndex(index)}>
                  <Tab
                    {...tab}
                    index={index}
                    hideBorder={hideBorder}
                    focusedIndex={focusedIndex}
                    focused={index === focusedIndex}
                  />
                </Link>
              ) : (
                <Pressable
                  onPress={() => {
                    setFocusedIndex(index);
                    tab.onClick?.();
                  }}
                >
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

        {width <= 600 && (
          <View className="flex flex-row gap-1 items-center">
            <Tab
              {...tabs[focusedIndex]}
              focused
              hideBorder={hideBorder}
              focusedIndex={focusedIndex}
            />

            <Button
              type="clear"
              size="lg"
              icon={faBars}
              className={!children ? "ml-auto" : ""}
              onClick={() => setExpanded(!expanded)}
            />

            <Dropdown
              xOffset={-64}
              expanded={expanded}
              setExpanded={setExpanded}
            >
              <Box className="flex justify-start items-start !p-0 mt-6 border-2 border-primary-300 !bg-background-100 !bg-opacity-95 overflow-auto max-h-[250px]">
                {tabs
                  .filter((tab) => tab.title !== tabs[focusedIndex].title)
                  .map((tab) => (
                    <Button
                      key={tab.title}
                      start
                      square
                      size="lg"
                      type="clear"
                      text={tab.title}
                      className="w-full"
                      onClick={() => {
                        if (tab.link) router.push(tab.link);
                        else if (tab.onClick) tab.onClick?.();

                        setFocusedIndex(
                          tabs.findIndex(
                            (swapTab) => tab.title === swapTab.title
                          )
                        );

                        setExpanded(false);
                      }}
                    />
                  ))}
              </Box>
            </Dropdown>
          </View>
        )}

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
