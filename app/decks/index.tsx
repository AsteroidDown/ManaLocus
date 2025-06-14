import DeckGallery from "@/components/decks/deck-gallery";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Footer from "@/components/ui/navigation/footer";
import Tooltip from "@/components/ui/tooltip/tooltip";
import UserContext from "@/contexts/user/user.context";
import DeckService from "@/hooks/services/deck.service";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import React, { useContext } from "react";
import { SafeAreaView, View } from "react-native";

export default function DecksPage() {
  const { user } = useContext(UserContext);

  function createDeck() {
    if (!user || !user.verified) return;

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
    <SafeAreaView>
      <View className="flex flex-1 gap-4 lg:px-16 px-4 py-4 min-h-[100dvh] bg-background-100">
        <BoxHeader
          className="!pb-0"
          title="Discover Decks"
          startIcon={faSearch}
          end={
            user &&
            user.verified && (
              <Tooltip
                text={
                  (user?.access?.deckCount || 0) > 0
                    ? `Decks created (${user?.deckCount}/${user?.access?.deckCount})`
                    : ""
                }
              >
                <Button
                  size="sm"
                  text="Deck"
                  icon={faPlus}
                  type="outlined"
                  onClick={createDeck}
                  disabled={
                    (user?.access?.deckCount || 0) > 0 &&
                    (user?.deckCount || 0) >= (user?.access?.deckCount || 0)
                  }
                />
              </Tooltip>
            )
          }
        />

        <DeckGallery noLoadScreen />
      </View>

      <Footer />
    </SafeAreaView>
  );
}
