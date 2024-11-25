import { BoardTypes } from "@/constants/boards";
import { titleCase } from "@/functions/text-manipulation";
import { Deck, DeckCard } from "@/models/deck/deck";
import { Link } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import CardText from "../cards/card-text";
import Divider from "../ui/divider/divider";
import TabBar from "../ui/tabs/tab-bar";
import Text from "../ui/text/text";

export interface DeckCardGalleryProps {
  deck: Deck;
}

export default function DeckCardGallery({ deck }: DeckCardGalleryProps) {
  const [boardType, setBoardType] = React.useState(BoardTypes.MAIN);

  const [boardCards, setBoardCards] = React.useState(
    {} as { [key: string]: DeckCard[] }
  );

  const [groupedCards, setGroupedCards] = React.useState(
    [] as { title: string; cards: DeckCard[] }[]
  );

  useEffect(() => {
    if (!deck) return;

    setBoardCards({
      main: deck.main,
      side: deck.side,
      maybe: deck.maybe,
      acquire: deck.acquire,
    });

    setBoardType(BoardTypes.MAIN);
  }, [deck]);

  useEffect(() => {
    if (!deck) return;

    const groupedCards = boardCards[boardType]?.reduce((acc, card) => {
      if (!acc[card.cardType]) acc[card.cardType] = [card];
      else acc[card.cardType].push(card);

      return acc;
    }, {} as { [key: string]: DeckCard[] });

    if (!groupedCards) return;
    setGroupedCards(
      Object.keys(groupedCards)?.map((key) => ({
        title: key,
        cards: groupedCards[key],
      })) ?? []
    );
  }, [boardCards, boardType]);

  return (
    <View className="flex flex-row flex-wrap gap-4 w-full">
      <TabBar
        hideBorder
        tabs={[
          BoardTypes.MAIN,
          BoardTypes.SIDE,
          BoardTypes.MAYBE,
          BoardTypes.ACQUIRE,
        ].map((board) => ({
          title: titleCase(board),
          onClick: () => setBoardType(board),
          children: (
            <View className="flex flex-row flex-wrap gap-4 w-full mt-2 columns-4">
              {groupedCards?.map(({ title, cards }) => (
                <Column key={title} title={title} cards={cards} />
              ))}
            </View>
          ),
        }))}
      />
    </View>
  );
}

function Column({ title, cards }: { title: string; cards?: DeckCard[] }) {
  return (
    <View className="flex-1 flex min-w-[256px]">
      <Text size="lg" thickness="bold">
        {titleCase(title)}
      </Text>

      <Divider thick className="!border-background-200 my-1" />

      <View className="flex gap-0.5">
        {cards?.map((card, index) => (
          <DeckCardHeader key={index} card={card} />
        ))}
      </View>
    </View>
  );
}

function DeckCardHeader({ card }: { card: DeckCard }) {
  return (
    <Link
      href={`cards/${card.setId}/${card.collectorNumber}`}
      className="flex flex-row gap-2 justify-between items-center px-2 py-0.5 rounded-full hover:bg-primary-200 transition-all duration-300"
    >
      <View className="flex-1 flex flex-row items-center gap-2">
        <Text>{card.count}</Text>
        <Text truncate thickness="medium">
          {card.name}
        </Text>
      </View>

      <CardText text={card.manaCost} />
    </Link>
  );
}
