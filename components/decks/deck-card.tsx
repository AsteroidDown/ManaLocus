import { BracketNumber } from "@/constants/mtg/brackets";
import { LostURL } from "@/constants/urls";
import { titleCase } from "@/functions/text-manipulation";
import { Deck } from "@/models/deck/deck";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Image, Pressable, View } from "react-native";
import CardText from "../cards/card-text";
import Icon from "../ui/icon/icon";
import Text from "../ui/text/text";

export interface DeckCardProps {
  deck: Deck;
  hideFormat?: boolean;
}

export default function DeckCard({ deck, hideFormat }: DeckCardProps) {
  const [hovered, setHovered] = React.useState(false);

  const bracket = deck.bracket || deck.bracketGuess;

  return (
    <Pressable
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={`relative rounded-xl overflow-hidden transition-all duration-300 border-2 focus:border-primary-300 border-transparent outline-none ${
        hovered
          ? "w-[296px] h-[200px] -m-1 !border-primary-300 shadow-[0_0_16px] shadow-primary-300"
          : "w-72 h-48"
      }`}
    >
      <Image
        source={{
          uri: deck.featuredArtUrl?.length ? deck.featuredArtUrl : LostURL,
        }}
        className="absolute w-full h-full"
      />

      <View className="absolute w-full h-full bg-gradient-to-b from-transparent from-70% to-black to-90% opacity-60" />

      <View
        className={`flex w-full h-full justify-between transition-all duration-300 ${
          hovered ? "px-3 py-3" : "px-2 py-2"
        }`}
      >
        <View className="flex flex-row justify-between items-center">
          {!hideFormat && (
            <View className="flex flex-row items-center gap-1">
              <Text
                size="xs"
                weight="bold"
                className={`px-2 py-1 bg-primary-200 bg-opacity-85 rounded-xl w-fit h-fit`}
              >
                {deck.format?.length ? titleCase(deck.format) : "TBD"}
              </Text>

              {bracket && (
                <Text
                  size="xs"
                  weight="bold"
                  className={`px-2 py-1 bg-dark-200 bg-opacity-85 rounded-xl w-fit h-fit`}
                >
                  {bracket}: {BracketNumber[bracket]}
                </Text>
              )}
            </View>
          )}

          {deck.colors?.length > 0 && (
            <View className="px-1 py-0.5 bg-dark-100 bg-opacity-70 rounded-xl">
              <CardText text={deck.colors} />
            </View>
          )}
        </View>

        <View className="flex">
          <Text size="lg" weight="bold">
            {deck.name}
          </Text>

          <View className="flex flex-row justify-between items-center gap-2">
            <Text size="xs" weight="medium">
              By {deck.user?.name}
            </Text>

            <View className="flex flex-row items-center gap-2">
              <View className="flex flex-row items-center gap-1">
                <Icon size="xs" icon={faEye} />

                <Text size="xs" weight="medium">
                  {deck.views}
                </Text>
              </View>

              <View className="flex flex-row items-center gap-1">
                <Icon size="xs" icon={faHeart} />

                <Text size="xs" weight="medium">
                  {deck.favorites}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
