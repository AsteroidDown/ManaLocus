import DeckChangeLog from "@/components/decks/deck-card-change";
import DeckCardGallery from "@/components/decks/deck-card-gallery";
import Button from "@/components/ui/button/button";
import Text from "@/components/ui/text/text";
import { BoardTypes } from "@/constants/boards";
import DeckContext from "@/contexts/deck/deck.context";
import UserContext from "@/contexts/user/user.context";
import { setLocalStorageCards } from "@/functions/local-storage/card-local-storage";
import DeckService from "@/hooks/services/deck.service";
import { DeckChange } from "@/models/deck/deck-change";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { Link } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Image, ScrollView, View } from "react-native";

export default function DeckPage() {
  const { user } = useContext(UserContext);
  const { deck } = useContext(DeckContext);

  const [changes, setChanges] = React.useState(null as DeckChange | null);

  useEffect(() => {
    if (!deck) return;

    setLocalStorageCards([], BoardTypes.MAIN);
    setLocalStorageCards([], BoardTypes.SIDE);
    setLocalStorageCards([], BoardTypes.MAYBE);
    setLocalStorageCards([], BoardTypes.ACQUIRE);

    DeckService.getChanges(deck.id).then((changes) => setChanges(changes));
  }, [deck]);

  if (!deck) return;

  return (
    <ScrollView>
      <View className="relative h-64">
        <Image
          source={{ uri: deck.featuredArtUrl }}
          className="absolute h-[384px] w-[60%] top-0 right-0"
        />

        <View className="absolute w-full h-full bg-gradient-to-r from-primary-300 from-[41%] to-transparent to-75%" />

        <View className="absolute w-full h-full bg-gradient-to-b from-transparent to-black opacity-40" />

        <View className="absolute flex justify-center w-full h-full px-11 top-0 left-0">
          <Text thickness="bold" className="!text-5xl">
            {deck.name}
          </Text>

          <Text size="lg" thickness="medium">
            By {deck.user?.name}
          </Text>
        </View>

        {user?.id === deck.userId && (
          <View className="absolute top-4 right-6 shadow-lg">
            <Link href={`${deck.id}/builder/main-board`}>
              <Button
                text="Edit"
                icon={faPen}
                action="primary"
                className="w-full"
              />
            </Link>
          </View>
        )}
      </View>

      <View className="flex flex-1 gap-4 px-11 py-8 min-h-[100vh] bg-background-100">
        <DeckCardGallery deck={deck} />

        {changes && <DeckChangeLog changes={changes} />}
      </View>
    </ScrollView>
  );
}
