import "@/global.css";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native";

export default function RootLayout() {
  return (
    <SafeAreaView className="flex w-full h-full bg-background-100">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="[userId]/index" />
      </Stack>
    </SafeAreaView>
  );
}
