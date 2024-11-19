import DeckContext from "@/contexts/deck/deck.context";
import UserContext from "@/contexts/user/user.context";
import "@/global.css";
import DeckService from "@/hooks/services/deck.service";
import { Deck } from "@/models/deck/deck";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect } from "react";

export default function BuilderLayout() {
  const { deckId } = useLocalSearchParams();
  const { user } = useContext(UserContext);

  const [deck, setDeck] = React.useState(null as Deck | null);

  useEffect(() => {
    if (typeof deckId === "string") {
      DeckService.getById(deckId, !user).then((deck) => setDeck(deck));
    }
  }, [deckId]);

  if (!deck) return;

  return (
    <DeckContext.Provider value={{ deck, setDeck }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="builder" options={{ headerShown: false }} />
      </Stack>
    </DeckContext.Provider>
  );
}
