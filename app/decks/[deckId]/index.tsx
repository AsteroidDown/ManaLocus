import Button from "@/components/ui/button/button";
import Text from "@/components/ui/text/text";
import DeckService from "@/hooks/services/deck.service";
import { Deck } from "@/models/deck/deck";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Image, ScrollView, View } from "react-native";

export default function DeckPage() {
  const { deckId } = useLocalSearchParams();

  const [deck, setDeck] = React.useState(null as Deck | null);

  useEffect(() => {
    if (typeof deckId === "string") {
      DeckService.getById(deckId).then((deck) => setDeck(deck));
    }
  }, [deckId]);

  if (!deck) return;

  return (
    <ScrollView>
      <View className="relative h-64">
        <Image
          source={{ uri: deck.featuredArtUrl }}
          className="absolute h-[457px] w-[50%] top-0 right-0"
        />

        <View className="absolute w-full h-full bg-gradient-to-r from-primary-300 from-[51%] to-transparent to-75%" />

        <View className="absolute w-full h-full bg-gradient-to-b from-transparent to-black opacity-40" />

        <View className="absolute flex justify-center w-full h-full px-11 top-0 left-0">
          <Text thickness="bold" className="!text-5xl">
            {deck.name}
          </Text>

          <Text size="lg" thickness="medium">
            By {deck.user?.name}
          </Text>
        </View>
      </View>

      <View className="flex flex-1 gap-4 px-11 py-8 min-h-[100vh] bg-background-100">
        <Link href={`${deck.id}/builder/main-board`}>
          <Button text="Edit" action="primary" className="w-full" />
        </Link>
      </View>
    </ScrollView>
  );
}
