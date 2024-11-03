import { currency } from "@/functions/text-manipulation";
import ScryfallService from "@/hooks/scryfall.service";
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
    <View className="flex max-w-[400px]">
      <View className="flex flex-row mb-2">
        <Text thickness="semi">Print</Text>

        <View className="flex flex-row gap-2 ml-auto">
          <Text size="sm" className="w-14">
            Number
          </Text>
          <Text size="sm" className="w-14">
            Price
          </Text>
        </View>
      </View>

      <View className="-mx-2">
        <Divider thick />
      </View>

      <ScrollView className="flex max-h-[264px] -mx-2">
        {cardPrints.map((print, index) => (
          <Link
            key={print.id + index}
            href={`cards/${print.set}/${print.collectorNumber}`}
            className={`flex flex-row gap-2 p-2 max-w-full border-b hover:bg-primary-300 transition-all duration-300 ${
              print.set === setId && print.collectorNumber === cardNumber
                ? "bg-background-300"
                : "border-background-100"
            }`}
          >
            <Text truncate size="sm">
              {print.setName}
            </Text>

            <View className="flex flex-row gap-2 ml-auto">
              <Text size="sm" className="w-14">
                {print.collectorNumber}
              </Text>

              <Text size="sm" className="w-14 text-right">
                {currency(print.prices?.usd)}
              </Text>
            </View>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
}
