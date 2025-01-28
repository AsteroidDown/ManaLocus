import DeckGallery from "@/components/decks/deck-gallery";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import BodyHeightContext from "@/contexts/ui/body-height.context";
import UserContext from "@/contexts/user/user.context";
import DeckService from "@/hooks/services/deck.service";
import { router } from "expo-router";
import React, { useContext, useRef } from "react";
import { SafeAreaView, View } from "react-native";

export default function DecksPage() {
  const { user } = useContext(UserContext);
  const { setBodyHeight } = useContext(BodyHeightContext);

  const containerRef = useRef<SafeAreaView>(null);

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
    <SafeAreaView
      ref={containerRef}
      onLayout={() =>
        containerRef.current?.measureInWindow((_x, _y, _width, height) =>
          setBodyHeight(height)
        )
      }
    >
      <View className="flex flex-1 gap-4 lg:px-16 px-4 py-8 min-h-[100dvh] bg-background-100">
        <BoxHeader
          title="Find Kits"
          className="!pb-0"
          end={user && <Button text="Create Kit" onClick={createDeck} />}
        />

        <DeckGallery kits />
      </View>
    </SafeAreaView>
  );
}
