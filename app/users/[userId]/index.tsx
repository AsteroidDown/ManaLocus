import DeckGallery from "@/components/decks/deck-gallery";
import UserContext from "@/contexts/user/user.context";
import React, { useContext } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const { user } = useContext(UserContext);

  if (!user) return null;

  return (
    <SafeAreaView className="flex-1 flex w-full h-full bg-background-100">
      <ScrollView className="my-4">
        <DeckGallery userId={user.id} />
      </ScrollView>
    </SafeAreaView>
  );
}
