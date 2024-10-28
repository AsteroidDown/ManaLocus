import Text from "@/components/ui/text/text";
import CardPreferencesContext from "@/contexts/cards/card-preferences.context";
import { Preferences } from "@/models/preferences/preferences";
import {
  faClipboardList,
  faClipboardQuestion,
  faCube,
  faList,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function TabLayout() {
  const [preferences, setPreferences] = React.useState({} as Preferences);

  return (
    <CardPreferencesContext.Provider value={{ preferences, setPreferences }}>
      <View className="flex flex-row w-full h-full bg-background-100">
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "rgb(var(--background-200))",
            tabBarStyle: {
              backgroundColor: "var(--background-200)",
              borderColor: "var(--background-100}",
              borderTopColor: "var(--background-100}",
            },
            tabBarIconStyle: {
              display: "none",
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Dashboard",
              tabBarLabel: ({ focused }) => (
                <View className="flex flex-row justify-center items-center gap-2 ">
                  <FontAwesomeIcon
                    icon={faCube}
                    size={"lg"}
                    className={focused ? "color-white" : "color-primary-400"}
                  />

                  <Text className={focused ? "" : "color-primary-400"}>
                    Dashboard
                  </Text>
                </View>
              ),
            }}
          />

          <Tabs.Screen
            name="main-board"
            options={{
              tabBarLabel: ({ focused }) => (
                <View
                  className={`flex flex-row justify-center items-center gap-2 `}
                >
                  <FontAwesomeIcon
                    icon={faList}
                    size={"lg"}
                    className={focused ? "color-white" : "color-primary-400"}
                  />

                  <Text
                    className={`whitespace-nowrap ${
                      focused ? "" : "color-primary-400"
                    }`}
                  >
                    Main
                  </Text>
                </View>
              ),
            }}
          />

          <Tabs.Screen
            name="side-board"
            options={{
              tabBarLabel: ({ focused }) => (
                <View className="flex flex-row justify-center items-center gap-2 ">
                  <FontAwesomeIcon
                    icon={faClipboardList}
                    size={"lg"}
                    className={focused ? "color-white" : "color-primary-400"}
                  />

                  <Text
                    className={`whitespace-nowrap ${
                      focused ? "" : "color-primary-400"
                    }`}
                  >
                    Side
                  </Text>
                </View>
              ),
            }}
          />

          <Tabs.Screen
            name="maybe-board"
            options={{
              tabBarLabel: ({ focused }) => (
                <View className="flex flex-row justify-center items-center gap-2 ">
                  <FontAwesomeIcon
                    icon={faClipboardQuestion}
                    size={"lg"}
                    className={focused ? "color-white" : "color-primary-400"}
                  />

                  <Text
                    className={`whitespace-nowrap ${
                      focused ? "" : "color-primary-400"
                    }`}
                  >
                    Maybe
                  </Text>
                </View>
              ),
            }}
          />

          <Tabs.Screen
            name="acquire-board"
            options={{
              tabBarLabel: ({ focused }) => (
                <View className="flex flex-row justify-center items-center gap-2 ">
                  <FontAwesomeIcon
                    icon={faListCheck}
                    size={"lg"}
                    className={focused ? "color-white" : "color-primary-400"}
                  />

                  <Text
                    className={`whitespace-nowrap ${
                      focused ? "" : "color-primary-400"
                    }`}
                  >
                    Acquire
                  </Text>
                </View>
              ),
            }}
          />
        </Tabs>
      </View>
    </CardPreferencesContext.Provider>
  );
}
