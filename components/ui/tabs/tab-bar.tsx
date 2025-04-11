import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link, router, Stack } from "expo-router";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Pressable, useWindowDimensions, View, ViewProps } from "react-native";
import Box from "../box/box";
import Button from "../button/button";
import Dropdown from "../dropdown/dropdown";
import Tab, { TabProps } from "./tab";

export interface TabDetails {
  [key: number]: {
    width: number;
    offset: number;
  };
}

export type TabBarProps = ViewProps & {
  tabs: TabProps[];
  containerClasses?: string;
};

export default function TabBar({
  tabs,
  className,
  containerClasses,
  children,
}: TabBarProps) {
  const width = useWindowDimensions().width;

  const containerRef = useRef<View>(null);

  const [focusedIndex, setFocusedIndex] = useState(0);

  const [details, setDetails] = useState({} as any);
  const [XOffset, setXOffset] = useState(0);

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

  function setTabDetails(index: number, width: number, offset: number) {
    if (index === tabs.length - 1) {
      setDetails({
        ...details,
        [`${index}`]: { width, offset },
      });
    } else {
      details[`${index}`] = { width, offset };
    }
  }

  return (
    <View
      key={tabs.length}
      ref={containerRef}
      className={`${className} relative flex-1 flex min-h-fit`}
      onLayout={() =>
        containerRef.current?.measureInWindow((x) => setXOffset(x))
      }
    >
      <TabsLayout
        tabs={tabs}
        children={children}
        focusedIndex={focusedIndex}
        setTabDetails={setTabDetails}
        setFocusedIndex={setFocusedIndex}
        containerClasses={containerClasses}
      />

      {details && (
        <View
          className={`absolute border-b-2 border-primary-200 transition-all duration-500 ease-out ${
            tabs[0]?.link ? "bottom-0" : "top-[34px]"
          }`}
          style={{
            width: details[focusedIndex]?.width ?? 0,
            left:
              width > 600
                ? (details[focusedIndex]?.offset ?? 0) -
                  (!tabs[0]?.link ? XOffset : 0)
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

interface TabsLayoutProps {
  tabs: TabProps[];
  containerClasses?: string;

  setTabDetails: (index: number, width: number, offset: number) => void;

  focusedIndex: number;
  setFocusedIndex: Dispatch<SetStateAction<number>>;

  children: any;
}

function TabsLayout({
  tabs,
  containerClasses,
  setTabDetails,
  focusedIndex,
  setFocusedIndex,
  children,
}: TabsLayoutProps) {
  const width = useWindowDimensions().width;

  const [expanded, setExpanded] = useState(false);

  return (
    <View className={`flex ${containerClasses}`}>
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
          <View className="flex flex-row gap-1 justify-between items-center w-full">
            <Tab
              {...tabs[focusedIndex]}
              focused
              setTabDetails={setTabDetails}
            />

            <View className="flex flex-row items-center">
              {width <= 600 && <View className="ml-auto">{children}</View>}

              <Button
                type="clear"
                icon={faBars}
                onClick={() => setExpanded(!expanded)}
              >
                <View className="-mx-1">
                  <Dropdown
                    xOffset={-112}
                    expanded={expanded}
                    setExpanded={setExpanded}
                  >
                    <Box className="flex justify-start items-start !p-0 mt-6 border-2 border-primary-300 !bg-background-100 !bg-opacity-95 overflow-auto max-h-[300px]">
                      {tabs
                        .filter((tab) => tab.title !== tabs[focusedIndex].title)
                        .map((tab) => (
                          <Button
                            key={tab.title}
                            start
                            square
                            size="sm"
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
              </Button>
            </View>
          </View>
        )}

        {width > 600 && <View className="ml-auto">{children}</View>}
      </View>
    </View>
  );
}
