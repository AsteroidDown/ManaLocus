import Text from "@/components/ui/text/text";
import { BoardTypes } from "@/constants/boards";
import BuilderPreferencesContext from "@/contexts/cards/builder-preferences.context";
import StoredCardsContext from "@/contexts/cards/stored-cards.context";
import DashboardContext from "@/contexts/dashboard/dashboard.context";
import DeckContext from "@/contexts/deck/deck.context";
import BuilderHeightContext from "@/contexts/ui/builder-height.context";
import UserContext from "@/contexts/user/user.context";
import {
  getLocalStorageStoredCards,
  saveLocalStorageCard,
  setLocalStorageCards,
} from "@/functions/local-storage/card-local-storage";
import { setLocalStorageDashboard } from "@/functions/local-storage/dashboard-local-storage";
import DeckService from "@/hooks/services/deck.service";
import { Card } from "@/models/card/card";
import { Dashboard } from "@/models/dashboard/dashboard";
import { BuilderPreferences } from "@/models/preferences/builder-preferences";
import {
  faClipboardList,
  faClipboardQuestion,
  faCube,
  faGear,
  faList,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tabs } from "expo-router";
import React, { useContext, useEffect } from "react";
import { useWindowDimensions, View } from "react-native";

export default function TabLayout() {
  const { deck } = useContext(DeckContext);
  const { user } = useContext(UserContext);

  const width = useWindowDimensions().width;
  const [builderHeight, setBuilderHeight] = React.useState(0);

  const [storedCards, setStoredCards] = React.useState([] as Card[]);
  const [dashboard, setDashboard] = React.useState(null as Dashboard | null);
  const [preferences, setPreferences] = React.useState(
    {} as BuilderPreferences
  );

  useEffect(() => {
    if (
      !deck ||
      deck.userId !== user?.id ||
      getLocalStorageStoredCards(BoardTypes.MAIN)?.length
    ) {
      return;
    }

    setLocalStorageCards([], BoardTypes.MAIN);
    setLocalStorageCards([], BoardTypes.SIDE);
    setLocalStorageCards([], BoardTypes.MAYBE);
    setLocalStorageCards([], BoardTypes.ACQUIRE);
    setLocalStorageDashboard({ sections: [] });

    if (deck.dashboard) {
      setDashboard(deck.dashboard);
      setLocalStorageDashboard(deck.dashboard);
    } else setDashboard(null);

    DeckService.get(deck.id).then((deck) => {
      deck.main.forEach((card) =>
        saveLocalStorageCard(card, card.count, BoardTypes.MAIN)
      );
      deck.side.forEach((card) =>
        saveLocalStorageCard(card, card.count, BoardTypes.SIDE)
      );
      deck.maybe.forEach((card) =>
        saveLocalStorageCard(card, card.count, BoardTypes.MAYBE)
      );
      deck.acquire.forEach((card) =>
        saveLocalStorageCard(card, card.count, BoardTypes.ACQUIRE)
      );

      setStoredCards(getLocalStorageStoredCards(BoardTypes.MAIN));
    });
  }, [deck]);

  return (
    <StoredCardsContext.Provider value={{ storedCards, setStoredCards }}>
      <DashboardContext.Provider value={{ dashboard, setDashboard }}>
        <BuilderPreferencesContext.Provider
          value={{ preferences, setPreferences }}
        >
          <BuilderHeightContext.Provider
            value={{ builderHeight, setBuilderHeight }}
          >
            <View className="flex flex-row w-full h-full bg-background-100">
              <Tabs
                screenOptions={{
                  headerShown: false,
                  tabBarStyle: {
                    backgroundColor: "#1a1625",
                    borderColor: "var(--background-100}",
                    borderTopColor: "var(--background-100}",
                    position: "sticky",
                    bottom: 0,
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
                      <View className="flex flex-row justify-center items-center gap-2 bg-background-100">
                        <FontAwesomeIcon
                          icon={faCube}
                          size={"lg"}
                          className={
                            focused ? "color-white" : "color-primary-400"
                          }
                        />

                        {width > 600 && (
                          <Text className={focused ? "" : "color-primary-400"}>
                            Dashboard
                          </Text>
                        )}
                      </View>
                    ),
                  }}
                />

                <Tabs.Screen
                  name="main-board"
                  options={{
                    tabBarLabel: ({ focused }) => (
                      <View className="flex flex-row justify-center items-center gap-2 bg-background-100">
                        <FontAwesomeIcon
                          icon={faList}
                          size={"lg"}
                          className={
                            focused ? "color-white" : "color-primary-400"
                          }
                        />

                        {width > 600 && (
                          <Text
                            className={`whitespace-nowrap ${
                              focused ? "" : "color-primary-400"
                            }`}
                          >
                            {deck?.isCollection ? "Collection" : "Main"}
                          </Text>
                        )}
                      </View>
                    ),
                  }}
                />

                <Tabs.Screen
                  name="trades"
                  options={{
                    ...(!deck?.isCollection && { href: null }),
                    tabBarLabel: ({ focused }) => (
                      <View
                        className={`flex flex-row justify-center items-center gap-2 bg-background-100 ${
                          !deck?.isCollection ? "hidden" : ""
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={faClipboardList}
                          size={"lg"}
                          className={
                            focused ? "color-white" : "color-primary-400"
                          }
                        />

                        {width > 600 && (
                          <Text
                            className={`whitespace-nowrap ${
                              focused ? "" : "color-primary-400"
                            }`}
                          >
                            Trades
                          </Text>
                        )}
                      </View>
                    ),
                  }}
                />

                <Tabs.Screen
                  name="side-board"
                  options={{
                    ...(deck?.isCollection && { href: null }),
                    tabBarLabel: ({ focused }) => (
                      <View className="flex flex-row justify-center items-center gap-2 bg-background-100">
                        <FontAwesomeIcon
                          icon={faClipboardList}
                          size={"lg"}
                          className={
                            focused ? "color-white" : "color-primary-400"
                          }
                        />

                        {width > 600 && (
                          <Text
                            className={`whitespace-nowrap ${
                              focused ? "" : "color-primary-400"
                            }`}
                          >
                            Side
                          </Text>
                        )}
                      </View>
                    ),
                  }}
                />

                <Tabs.Screen
                  name="maybe-board"
                  options={{
                    ...(deck?.isCollection && { href: null }),
                    tabBarLabel: ({ focused }) => (
                      <View className="flex flex-row justify-center items-center gap-2 bg-background-100">
                        <FontAwesomeIcon
                          icon={faClipboardQuestion}
                          size={"lg"}
                          className={
                            focused ? "color-white" : "color-primary-400"
                          }
                        />

                        {width > 600 && (
                          <Text
                            className={`whitespace-nowrap ${
                              focused ? "" : "color-primary-400"
                            }`}
                          >
                            Maybe
                          </Text>
                        )}
                      </View>
                    ),
                  }}
                />

                <Tabs.Screen
                  name="acquire-board"
                  options={{
                    tabBarLabel: ({ focused }) => (
                      <View className="flex flex-row justify-center items-center gap-2 bg-background-100">
                        <FontAwesomeIcon
                          icon={faListCheck}
                          size={"lg"}
                          className={
                            focused ? "color-white" : "color-primary-400"
                          }
                        />

                        {width > 600 && (
                          <Text
                            className={`whitespace-nowrap ${
                              focused ? "" : "color-primary-400"
                            }`}
                          >
                            Acquire
                          </Text>
                        )}
                      </View>
                    ),
                  }}
                />

                <Tabs.Screen
                  name="deck-settings"
                  options={{
                    tabBarLabel: ({ focused }) => (
                      <View className="flex flex-row justify-center items-center gap-2 bg-background-100">
                        <FontAwesomeIcon
                          size="lg"
                          icon={faGear}
                          className={
                            focused ? "color-white" : "color-primary-400"
                          }
                        />

                        {width > 600 && (
                          <Text
                            className={`whitespace-nowrap ${
                              focused ? "" : "color-primary-400"
                            }`}
                          >
                            Settings
                          </Text>
                        )}
                      </View>
                    ),
                  }}
                />
              </Tabs>
            </View>
          </BuilderHeightContext.Provider>
        </BuilderPreferencesContext.Provider>
      </DashboardContext.Provider>
    </StoredCardsContext.Provider>
  );
}
