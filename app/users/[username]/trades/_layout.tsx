import "@/global.css";
import { Stack } from "expo-router";
import React from "react";

export default function TradesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="new-trade" options={{ headerShown: false }} />
      <Stack.Screen name="[tradeId]/index" options={{ headerShown: false }} />
    </Stack>
  );
}
