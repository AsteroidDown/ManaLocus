import { titleCase } from "@/functions/text-manipulation";
import { Deck } from "@/models/deck/deck";
import React from "react";
import { Image, Pressable, View } from "react-native";
import Text from "../ui/text/text";

export interface DeckCardProps {
  deck: Deck;
  hideFormat?: boolean;
}

export default function DeckCard({ deck, hideFormat }: DeckCardProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Pressable
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={`relative rounded-xl overflow-hidden transition-all duration-300 border-2 focus:border-primary-300 border-transparent outline-none ${
        hovered ? "w-[296px] h-[200px] -m-1" : "w-72 h-48"
      }`}
    >
      <Image
        source={{ uri: deck.featuredArtUrl }}
        className="absolute w-full h-full"
      />

      <View className="absolute w-full h-full bg-gradient-to-b from-transparent from-70% to-black to-90% opacity-60" />

      <View
        className={`flex w-full h-full justify-between transition-all duration-300 ${
          hovered ? "px-3 py-3" : "px-2 py-2"
        }`}
      >
        <View className="flex flex-row">
          {!hideFormat && (
            <Text
              size="xs"
              thickness="bold"
              className={`px-2 py-1 bg-primary-200 bg-opacity-85 rounded-xl w-fit`}
            >
              {titleCase(deck.format)}
            </Text>
          )}

          <View
            className={`ml-auto bg-dark-100 bg-opacity-70 rounded-bl-lg transition-all duration-300 ${
              hovered ? "-mt-3 -mr-3" : "-mt-2 -mr-2"
            }`}
          >
            {/* <CardText text={"{" + deck.colors.join("}{") + "}"} /> */}
          </View>
        </View>

        <View className="flex">
          <Text size="lg" thickness="bold">
            {deck.name}
          </Text>

          <Text
            size="xs"
            thickness="medium"
            className={`mt-auto mb-1 transition-all duration-300`}
          >
            By {deck.user?.name}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
