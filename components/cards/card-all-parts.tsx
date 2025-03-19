import ScryfallService from "@/hooks/services/scryfall.service";
import { Card, CardPart } from "@/models/card/card";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import Text from "../ui/text/text";

export interface CardAllPartsProps {
  parts: CardPart[];
}

export default function CardAllPartsList({ parts }: CardAllPartsProps) {
  const [cards, setCards] = useState([] as Card[]);

  useEffect(() => {
    ScryfallService.getCardsFromCollection(
      parts.map((part) => ({ id: part.id }))
    ).then((cards) => setCards(cards));
  }, [parts]);

  return (
    <View className="flex lg:w-[350px] w-full max-h-fit overflow-hidden">
      <View className="flex flex-row gap-2 p-2 max-w-full">
        <Text weight="semi">Related Cards, Parts, and Tokens</Text>
      </View>

      <ScrollView className="flex max-h-[132px] border-2 border-primary-200 border-opacity-30 rounded-md">
        {cards.map((card, index) => (
          <View key={index}>
            <Link
              href={`cards/${card.set}/${card.collectorNumber}`}
              className={`flex flex-row gap-2 p-2 max-w-full hover:bg-primary-300 hover:bg-opacity-50 transition-all duration-300 ${
                index % 2 === 1 ? "bg-background-200" : "border-background-100"
              }`}
            >
              <Text truncate size="xs">
                {card.name}
              </Text>

              <View className="flex flex-row gap-2 ml-auto">
                <Text size="xs" className="w-16">
                  {card.collectorNumber}
                </Text>
              </View>
            </Link>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
