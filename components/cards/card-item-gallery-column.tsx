import Divider from "@/components/ui/divider/divider";
import Text from "@/components/ui/text/text";
import { getCountOfCards } from "@/functions/card-stats";
import { Card } from "@/models/card/card";
import React from "react";
import { View } from "react-native";
import CardItem from "./card-item";

export interface CardItemGalleryColumnProps {
  title: string;
  cards: Card[];
  condensed?: boolean;
  hideImages?: boolean;
  itemsExpanded?: number;
  setItemExpanded: React.Dispatch<React.SetStateAction<number>>;
}

export default function CardItemGalleryColumn({
  title,
  cards,
  condensed = false,
  hideImages = false,
  itemsExpanded,
  setItemExpanded,
}: CardItemGalleryColumnProps) {
  const cardCount = getCountOfCards(cards);

  const columnClasses =
    "flex gap-2 py-2 my-2 w-[256px] max-w-[256px] rounded-xl bg-background-300 bg-opacity-30";

  return (
    <View className={`${columnClasses}`}>
      <View className="flex justify-center items-center mx-2">
        <Text size="lg" thickness="bold">
          {title}
        </Text>

        <Text thickness="semi">
          {cardCount} Card{cardCount !== 1 ? "s" : ""}
        </Text>
      </View>

      <Divider thick />

      <View className={`flex ${condensed ? "gap-1 mx-0" : "gap-2 mx-2"}`}>
        {cards.map((card, index) => (
          <CardItem
            key={card.scryfallId + index}
            card={card}
            condensed={condensed}
            hideImage={hideImages}
            itemsExpanded={itemsExpanded}
            setItemsExpanded={setItemExpanded}
          />
        ))}
      </View>
    </View>
  );
}
