import { titleCase } from "@/functions/text-manipulation";
import { Deck, DeckCard } from "@/models/deck/deck";
import React, { useEffect } from "react";
import { View } from "react-native";
import CardText from "../cards/card-text";
import TabBar from "../ui/tabs/tab-bar";
import Text from "../ui/text/text";

export interface DeckCardGalleryProps {
  deck: Deck;
}

export default function DeckCardGallery({ deck }: DeckCardGalleryProps) {
  const [boardCards, setBoardCards] = React.useState(
    {} as { [key: string]: DeckCard[] }
  );

  useEffect(() => {
    if (!deck) return;

    setBoardCards({
      main: deck.main,
      side: deck.side,
      maybe: deck.maybe,
      acquire: deck.acquire,
    });
  }, [deck]);

  return (
    <View className="flex flex-row flex-wrap gap-4 w-full">
      <TabBar
        hideBorder
        tabs={["main", "side", "maybe", "acquire"].map((board, boardIndex) => ({
          title: titleCase(board),
          children: (
            <View className="flex">
              {boardCards[board]?.map((card, index) => (
                <DeckCardHeader key={index} card={card} />
              ))}
            </View>
          ),
        }))}
      />
    </View>
  );
}

function DeckCardHeader({ card }: { card: DeckCard }) {
  return (
    <View className="flex flex-row justify-between items-center px-2 py-1 rounded-full hover:bg-primary-200 transition-all duration-300">
      <View className="flex flex-row items-center gap-2">
        <Text>{card.count}</Text>
        <Text thickness="medium">{card.name}</Text>
      </View>

      <CardText text={card.manaCost} />
    </View>
  );
}

function Column({ title, cards }: { title: string; cards?: DeckCard[] }) {
  return (
    <View className="flex-1 flex min-w-[256px]">
      <Text size="lg" thickness="bold" className="mb-2">
        {title}
      </Text>

      <View className="flex gap-0.5">
        {cards?.map((card, index) => (
          <View key={index} className="rounded-xl overflow-hidden">
            <Text>{card.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
