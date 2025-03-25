import Footer from "@/components/ui/navigation/footer";
import React from "react";
import { View } from "react-native";
import DeckSettingsPage from "./index";

export default function DeckSettingsLayout() {
  return (
    <View className="flex">
      <DeckSettingsPage />

      <Footer />
    </View>
  );
}
