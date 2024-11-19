import "@/global.css";
import { Stack } from "expo-router";
import React from "react";

export default function BuilderLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[deckId]/index" options={{ headerShown: false }} />
      <Stack.Screen name="[deckId]/builder" options={{ headerShown: false }} />
    </Stack>
  );
}
