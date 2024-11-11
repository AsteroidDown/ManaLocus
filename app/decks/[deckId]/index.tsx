import Text from "@/components/ui/text/text";
import { Deck } from "@/models/deck/deck";
import { Image, ScrollView, View } from "react-native";

export default function DeckPage() {
  const deck: Deck = {
    id: "1",
    userId: "1",
    user: { id: "1", name: "User 1", email: "user1@manalocus.com" },
    name: "Omnath, Locus of Creation",
    featuredArtUrl:
      "https://cards.scryfall.io/art_crop/front/4/e/4e4fb50c-a81f-44d3-93c5-fa9a0b37f617.jpg?1639436752",
    format: "commander",
    colors: ["W", "U", "R", "G"],
    cards: ["1", "2", "3", "4", "5"],
  };

  if (!deck.user) return;

  return (
    <ScrollView>
      <View className="relative h-64">
        <Image
          source={{ uri: deck.featuredArtUrl }}
          className="absolute h-[457px] w-[50%] top-0 right-0"
        />

        <View className="absolute w-full h-full bg-gradient-to-r from-background-200 from-[51%] to-transparent to-75%" />

        <View className="absolute flex justify-center w-full h-full px-11 top-0 left-0">
          <Text thickness="bold" className="!text-5xl">
            {deck.name}
          </Text>

          <Text size="lg" thickness="medium">
            By {deck.user.name}
          </Text>
        </View>
      </View>

      <View className="flex flex-1 gap-4 px-11 py-8 min-h-[100vh] bg-background-100"></View>
    </ScrollView>
  );
}
