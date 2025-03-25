import TabBar from "@/components/ui/tabs/tab-bar";
import Text from "@/components/ui/text/text";
import { BoardTypes } from "@/constants/boards";
import BuilderPreferencesContext from "@/contexts/cards/builder-preferences.context";
import StoredCardsContext from "@/contexts/cards/stored-cards.context";
import DashboardContext from "@/contexts/dashboard/dashboard.context";
import DeckContext from "@/contexts/deck/deck.context";
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
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect } from "react";
import { useWindowDimensions, View } from "react-native";

export default function TabLayout() {
  const { deck } = useContext(DeckContext);
  const { user } = useContext(UserContext);

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
          <TabBar
            className="w-full min-h-fit bg-background-100"
            containerClasses="lg:px-6 px-4 pt-4"
            tabs={[
              {
                title: "Dashboard",
                link: `decks/${deck?.id}/builder`,
              },
              {
                title: "Main",
                link: `decks/${deck?.id}/builder/main-board`,
              },
              ...(deck?.isCollection
                ? [
                    {
                      title: "Trades",
                      link: `decks/${deck?.id}/builder/trades`,
                    },
                  ]
                : []),
              {
                title: "Side",
                link: `decks/${deck?.id}/builder/side-board`,
              },
              ...(!deck?.isCollection && !deck?.isKit
                ? [
                    {
                      title: "Maybe",
                      link: `decks/${deck?.id}/builder/maybe-board`,
                    },
                    {
                      title: "Acquire",
                      link: `decks/${deck?.id}/builder/acquire-board`,
                    },
                  ]
                : []),
              {
                title: "Settings",
                link: `decks/${deck?.id}/builder/deck-settings`,
              },
            ]}
          />
        </BuilderPreferencesContext.Provider>
      </DashboardContext.Provider>
    </StoredCardsContext.Provider>
  );
}

function Tab({
  focused,
  icon,
  title,
}: {
  title: string;
  focused: boolean;
  icon: IconDefinition;
}) {
  const width = useWindowDimensions().width;

  return (
    <View className="flex lg:flex-row justify-center items-center lg:gap-2 gap-1 bg-background-100">
      <FontAwesomeIcon
        size="lg"
        icon={icon}
        className={focused ? "color-gray-200" : "color-primary-200"}
      />

      <Text
        noWrap
        size={width > 600 ? "sm" : "xs"}
        action={focused ? "default" : "primary"}
      >
        {title}
      </Text>
    </View>
  );
}
