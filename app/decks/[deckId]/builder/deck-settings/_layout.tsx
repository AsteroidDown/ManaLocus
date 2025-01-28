import React from "react";
import { SafeAreaView } from "react-native";
import DeckSettingsPage from "./index";

export default function AcquireBoardLayout() {
  return (
    <SafeAreaView className="px-10 py-4 min-h-[100dvh] bg-background-100">
      <DeckSettingsPage></DeckSettingsPage>
    </SafeAreaView>
  );
}
