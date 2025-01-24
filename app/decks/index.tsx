import DeckGallery from "@/components/decks/deck-gallery";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import UserContext from "@/contexts/user/user.context";
import DeckService from "@/hooks/services/deck.service";
import { router } from "expo-router";
import React, { useContext } from "react";
import { ScrollView, View } from "react-native";

export default function DecksPage() {
  const { user } = useContext(UserContext);

  function createDeck() {
    if (!user) return;

    DeckService.create({}).then((response) => {
      localStorage.removeItem("builderCardsMain");
      localStorage.removeItem("builderCardsSide");
      localStorage.removeItem("builderCardsMaybe");
      localStorage.removeItem("builderCardsAcquire");
      localStorage.removeItem("builderKits");
      localStorage.removeItem("dashboard");

      router.push(`decks/${response.deckId}/builder/main-board`);
    });
  }

  return (
    <ScrollView>
      <View className="flex flex-1 gap-4 lg:px-16 px-4 py-8 min-h-[100dvh] bg-background-100">
        <BoxHeader
          title="Find Decks"
          className="!pb-0"
          end={user && <Button text="Create Deck" onClick={createDeck} />}
        />

        <DeckGallery />
      </View>
    </ScrollView>
  );
}
