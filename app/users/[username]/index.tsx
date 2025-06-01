import DeckGallery from "@/components/decks/deck-gallery";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Footer from "@/components/ui/navigation/footer";
import UserPageContext from "@/contexts/user/user-page.context";
import UserContext from "@/contexts/user/user.context";
import DeckService from "@/hooks/services/deck.service";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import React, { useContext } from "react";
import { SafeAreaView, View } from "react-native";

export default function Login() {
  const { user } = useContext(UserContext);
  const { userPageUser } = useContext(UserPageContext);

  if (!userPageUser) return null;

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
    <SafeAreaView className="flex-1 flex w-full h-full bg-background-100">
      <View className="lg:px-16 px-4 py-4 min-h-[100dvh] bg-background-100">
        <BoxHeader
          title={`${
            user?.id === userPageUser?.id ? "Your" : `${userPageUser?.name}'s`
          } Decks`}
          subtitle={
            user?.id === userPageUser?.id
              ? "View and manage your decks"
              : `See what ${userPageUser?.name} has created`
          }
          end={
            user &&
            user.id === userPageUser.id &&
            user.verified && (
              <Button
                size="sm"
                text="Deck"
                type="outlined"
                icon={faPlus}
                className="self-end"
                onClick={createDeck}
              />
            )
          }
        />

        <DeckGallery noLoadScreen userId={userPageUser.id} />
      </View>

      <Footer />
    </SafeAreaView>
  );
}
