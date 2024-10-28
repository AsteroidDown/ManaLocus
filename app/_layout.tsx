import Text from "@/components/ui/text/text";
import StoredCardsContext from "@/contexts/cards/stored-cards.context";
import DashboardContext from "@/contexts/dashboard/dashboard.context";
import { getLocalStorageStoredCards } from "@/functions/local-storage/card-local-storage";
import { getLocalStorageDashboard } from "@/functions/local-storage/dashboard-local-storage";
import "@/global.css";
import { Card } from "@/models/card/card";
import { Dashboard } from "@/models/dashboard/dashboard";
import { Link, Stack } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView, View } from "react-native";
import Button from "../components/ui/button/button";

export default function RootLayout() {
  const [storedCards, setStoredCards] = React.useState([] as Card[]);

  const [dashboard, setDashboard] = React.useState(null as Dashboard | null);

  useEffect(() => {
    setDashboard(getLocalStorageDashboard());
    setStoredCards(getLocalStorageStoredCards());
  }, []);

  return (
    <SafeAreaView className="flex w-full h-full bg-background-100">
      <StoredCardsContext.Provider value={{ storedCards, setStoredCards }}>
        <DashboardContext.Provider value={{ dashboard, setDashboard }}>
          <Stack
            screenOptions={{
              headerTitle: () => <Logo />,
              headerTintColor: "rgb(var(--background-200))",
              headerStyle: {
                backgroundColor: "black",
              },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="builder" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </DashboardContext.Provider>
      </StoredCardsContext.Provider>
    </SafeAreaView>
  );
}

function Logo() {
  return (
    <View className="flex flex-row items-center gap-2 px-6 py-4">
      <Link href="/">
        <Text size="2xl" thickness="medium" className="mr-2">
          Mana Locus
        </Text>
      </Link>

      <Button type="clear" text="Decks" size="lg" />

      <Link href="/cards">
        <Button type="clear" text="Cards" size="lg" />
      </Link>

      <Button type="clear" text="Explore" size="lg" />
    </View>
  );
}
