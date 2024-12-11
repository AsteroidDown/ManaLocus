import DeckGallery from "@/components/decks/deck-gallery";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import UserContext from "@/contexts/user/user.context";
import DeckService from "@/hooks/services/deck.service";
import React, { useContext } from "react";
import { ScrollView, View } from "react-native";

export default function DecksPage() {
  const { user } = useContext(UserContext);

  function createDeck() {
    if (!user) return;

    DeckService.create({});
  }

  return (
    <ScrollView>
      <View className="flex flex-1 gap-4 px-16 py-8 min-h-[100vh] bg-background-100">
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
