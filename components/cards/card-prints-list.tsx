import { currency } from "@/functions/text-manipulation";
import ScryfallService from "@/hooks/services/scryfall.service";
import { Card } from "@/models/card/card";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import Divider from "../ui/divider/divider";
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
    <View className="flex lg:w-[400px] w-full max-h-fit border-2 border-dark-200 rounded-lg overflow-hidden">
      <View className="flex flex-row gap-2 p-2 max-w-full bg-dark-200">
        <Text weight="semi">Print</Text>

        <View className="flex flex-row gap-2 ml-auto">
          <Text size="sm" className="w-16">
            Number
          </Text>
          <Text size="sm" className="w-14">
            Price
          </Text>
        </View>
      </View>

      <ScrollView className="flex max-h-[264px]">
        {cardPrints.map((print, index) => (
          <View key={index}>
            <Link
              key={print.scryfallId + index}
              href={`cards/${print.set}/${print.collectorNumber}`}
              className={`flex flex-row gap-2 p-2 max-w-full hover:bg-primary-300 transition-all duration-300 ${
                print.set === setId && print.collectorNumber === cardNumber
                  ? "bg-background-300"
                  : "border-background-100"
              }`}
            >
              <Text truncate size="sm">
                {print.setName}
              </Text>

              <View className="flex flex-row gap-2 ml-auto">
                <Text size="sm" className="w-16">
                  {print.collectorNumber}
                </Text>

                <Text size="sm" className="w-14">
                  {currency(print.prices?.usd)}
                </Text>
              </View>
            </Link>

            {index < cardPrints.length - 1 && (
              <Divider thick className="!border-background-200" />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
