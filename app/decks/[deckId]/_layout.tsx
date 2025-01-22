import { MTGFormat } from "@/constants/mtg/mtg-format";
import DeckContext from "@/contexts/deck/deck.context";
import "@/global.css";
import DeckService from "@/hooks/services/deck.service";
import { Card } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";

export default function BuilderLayout() {
  const { deckId } = useLocalSearchParams();

  const [deck, setDeck] = React.useState(null as Deck | null);
  const [format, setFormat] = React.useState(null as MTGFormat | null);
  const [commander, setCommander] = React.useState(null as Card | null);
  const [partner, setPartner] = React.useState(null as Card | null);

  useEffect(() => {
    if (typeof deckId === "string") {
      DeckService.get(deckId).then((deck) => {
        setDeck(deck);
        setFormat(deck.format);
        if (deck.commander) setCommander(deck.commander);
        if (deck.partner) setPartner(deck.partner);
      });
    }
  }, [deckId]);

  if (!deck) return;

  return (
    <DeckContext.Provider
      value={{
        deck,
        setDeck,
        format,
        setFormat,
        commander,
        setCommander,
        partner,
        setPartner,
      }}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="builder" options={{ headerShown: false }} />
        <Stack.Screen name="packs" options={{ headerShown: false }} />
      </Stack>
    </DeckContext.Provider>
  );
}
