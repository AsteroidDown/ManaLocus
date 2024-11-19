import React from "react";
import { ScrollView } from "react-native";
import DeckSettingsPage from "./index";

export default function AcquireBoardLayout() {
  return (
    <ScrollView className="px-10 py-4 bg-background-100">
      <DeckSettingsPage></DeckSettingsPage>
    </ScrollView>
  );
}
