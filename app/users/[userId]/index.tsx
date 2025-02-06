import DeckGallery from "@/components/decks/deck-gallery";
import Button from "@/components/ui/button/button";
import BodyHeightContext from "@/contexts/ui/body-height.context";
import UserPageContext from "@/contexts/user/user-page.context";
import UserContext from "@/contexts/user/user.context";
import DeckService from "@/hooks/services/deck.service";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import React, { useContext, useRef } from "react";
import { SafeAreaView, View } from "react-native";

export default function Login() {
  const { user } = useContext(UserContext);
  const { userPageUser } = useContext(UserPageContext);
  const { setBodyHeight } = useContext(BodyHeightContext);

  const containerRef = useRef<View>(null);

  const buffer = 164;

  if (!userPageUser) return null;

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
    <SafeAreaView className="flex-1 flex w-full h-full bg-background-100">
      <View
        ref={containerRef}
        className="my-4"
        onLayout={() =>
          containerRef.current?.measureInWindow((_x, _y, _width, height) =>
            setBodyHeight(height + buffer)
          )
        }
      >
        <View className="flex flex-row justify-end">
          <Button
            text="Create Collection"
            type="outlined"
            icon={faPlus}
            className="self-end"
            onClick={createDeck}
          />
        </View>

        <DeckGallery userId={userPageUser.id} />
      </View>
    </SafeAreaView>
  );
}
