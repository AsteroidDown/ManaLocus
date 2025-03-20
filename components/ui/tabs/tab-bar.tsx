import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link, router, Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, useWindowDimensions, View, ViewProps } from "react-native";
import Box from "../box/box";
import Button from "../button/button";
import Dropdown from "../dropdown/dropdown";
import Tab, { TabProps } from "./tab";

const tabDetails: { [key: string]: { width: number; offset: number } } = {};

export type TabBarProps = ViewProps & {
  tabs: TabProps[];
};

export default function TabBar({ tabs, className, children }: TabBarProps) {
  const width = useWindowDimensions().width;

  const containerRef = useRef<View>(null);

  const [focusedIndex, setFocusedIndex] = useState(0);

  const [details, setDetails] = useState(
    null as { [key: string]: { width: number; offset: number } } | null
  );
  const [XOffset, setXOffset] = useState(0);

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!tabs?.[0]?.link) return;

    let tabIndex = 0;

    tabs.forEach((tab, index) => {
      if (focusedIndex === index || tabIndex === index) return;

      if (window.location.href?.includes(tab.link?.toString() || "")) {
        tabIndex = index;
      }
    });

    if (tabIndex && tabIndex !== focusedIndex) setFocusedIndex(tabIndex);
  }, [window.location.href]);

  useEffect(() => {
    if (!XOffset || details) return;

    tabs.forEach((tab, index) => {
      const tabInfo = tabDetails[`${tab.title}_${index}`];
      tabDetails[`${tab.title}_${index}`] = {
        width: tabInfo?.width ?? 0,
        offset: (tabInfo?.offset ?? 0) - XOffset,
      };
    });

    setDetails(tabDetails);
  }, [XOffset]);

  function setTabDetails(index: number, width: number, offset: number) {
    tabDetails[`${tabs[index]?.title}_${index}`] = {
      width,
      offset: offset - XOffset,
    };
  }

  return (
    <View
      key={tabs.length}
      ref={containerRef}
      className={`${className} relative flex-1 flex`}
      onLayout={() =>
        containerRef.current?.measureInWindow((x) => setXOffset(x))
      }
    >
      <View
        className={`flex-1 flex flex-row w-full min-h-[36px] max-h-[36px] border-b-2 border-background-200 overflow-x-auto overflow-y-hidden`}
      >
        {width > 600 &&
          tabs.map((tab, index) => (
            <View key={tab.title + index}>
              {tab.link ? (
                <Link href={tab.link} onPress={() => setFocusedIndex(index)}>
                  <Tab
                    {...tab}
                    index={index}
                    setTabDetails={setTabDetails}
                    focused={index === focusedIndex}
                  />
                </Link>
              ) : (
                <Pressable
                  onPress={() => {
                    tab.onClick?.();
                    setFocusedIndex(index);
                  }}
                >
                  <Tab
                    {...tab}
                    index={index}
                    setTabDetails={setTabDetails}
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
              setTabDetails={setTabDetails}
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

      {details && (
        <View
          className="absolute top-[34px] border-b-2 border-primary-200 w-10 transition-all duration-500 ease-out"
          style={{
            width:
              details[`${tabs[focusedIndex].title}_${focusedIndex}`]?.width ??
              0,
            left:
              width > 600
                ? details[`${tabs[focusedIndex].title}_${focusedIndex}`]
                    ?.offset ?? 0
                : 0,
          }}
        />
      )}

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
