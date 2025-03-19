import { currency } from "@/functions/text-manipulation";
import ScryfallService from "@/hooks/services/scryfall.service";
import { Card } from "@/models/card/card";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import Text from "../ui/text/text";

export interface CardPrintsListProps {
  card?: Card;
}

export default function CardPrintsList({ card }: CardPrintsListProps) {
  const { setId, cardNumber } = useLocalSearchParams();

  const [cardPrints, setCardPrints] = React.useState([] as Card[]);

  useEffect(() => {
    if (!card) return;

    ScryfallService.getCardPrints(card.name).then((prints) =>
      setCardPrints(prints)
    );
  }, [card]);

  return (
    <View className="flex lg:w-[350px] w-full max-h-fit overflow-hidden">
      <View className="flex flex-row gap-2 p-2 max-w-full border-opacity-30">
        <Text weight="semi">Prints</Text>
      </View>

      <ScrollView className="flex max-h-[132px] border-2 border-primary-200 border-opacity-30 rounded-md">
        {cardPrints.map((print, index) => (
          <View key={index}>
            <Link
              href={`cards/${print.set}/${print.collectorNumber}`}
              className={`flex flex-row gap-2 p-2 max-w-full hover:bg-primary-300 hover:bg-opacity-50 transition-all duration-300 ${
                index % 2 === 1 ? "bg-background-200" : "border-background-100"
              }`}
            >
              <Text truncate size="xs">
                {print.setName} #{print.collectorNumber}
              </Text>

              <View className="flex flex-row gap-2 ml-auto">
                <Text size="xs" className="w-16">
                  {currency(print.prices?.usd)}
                </Text>
              </View>
            </Link>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
