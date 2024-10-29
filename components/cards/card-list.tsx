import { Card } from "@/models/card/card";
import { View } from "react-native";
import BoxHeader from "../ui/box/box-header";
import CardImage from "./card-image";

export interface CardListProps {
  title?: string;
  subtitle?: string;
  cards: Card[];
}

export default function CardList({ title, subtitle, cards }: CardListProps) {
  return (
    <View className="flex mt-4 w-full">
      <BoxHeader title={title} subtitle={subtitle} />

      <View className="flex flex-row flex-wrap gap-2">
        {cards.map((card, index) => (
          <CardImage key={card.id + index} card={card} />
        ))}
      </View>
    </View>
  );
}
