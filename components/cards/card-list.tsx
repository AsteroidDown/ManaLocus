import { Card } from "@/models/card/card";
import { Link, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import CardImage from "./card-image";

export interface CardListProps {
  title?: string;
  subtitle?: string;
  cards: Card[];
}

export default function CardList({ title, subtitle, cards }: CardListProps) {
  const { setId } = useLocalSearchParams();

  return (
    <View className="flex mt-4 w-full">
      {/* <BoxHeader title={title} subtitle={subtitle} /> */}

      <View className="flex flex-row flex-wrap gap-2">
        {cards.map((card, index) => (
          <Link
            key={card.scryfallId + index}
            href={`cards/${setId}/${card.collectorNumber}`}
          >
            <CardImage card={card} />
          </Link>
        ))}
      </View>
    </View>
  );
}
