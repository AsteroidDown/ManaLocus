import { BoardTypes } from "@/constants/boards";
import { sortDeckCardsAlphabetically } from "@/functions/card-sorting";
import {
  DeckCardGalleryGroupType,
  DeckCardGalleryGroupTypes,
  getCardGroupOrder,
} from "@/functions/deck-card-ordering";
import { titleCase } from "@/functions/text-manipulation";
import { Deck, DeckCard } from "@/models/deck/deck";
import { Link } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import CardText from "../cards/card-text";
import Divider from "../ui/divider/divider";
import Select from "../ui/input/select";
import TabBar from "../ui/tabs/tab-bar";
import Text from "../ui/text/text";

export interface DeckCardGalleryProps {
  deck: Deck;
}

export default function DeckCardGallery({ deck }: DeckCardGalleryProps) {
  const [boardType, setBoardType] = React.useState(BoardTypes.MAIN);
  const [groupType, setGroupType] = React.useState(
    "cardType" as DeckCardGalleryGroupType
  );

  const [boardCards, setBoardCards] = React.useState(
    {} as { [key: string]: DeckCard[] }
  );

  const [groupedCards, setGroupedCards] = React.useState(
    [] as { title: string; cards: DeckCard[] }[]
  );

  useEffect(() => {
    if (!deck) return;

    setBoardCards({
      main: sortDeckCardsAlphabetically(deck.main),
      side: sortDeckCardsAlphabetically(deck.side),
      maybe: sortDeckCardsAlphabetically(deck.maybe),
      acquire: sortDeckCardsAlphabetically(deck.acquire),
    });

    setBoardType(BoardTypes.MAIN);
  }, [deck]);

  useEffect(() => {
    if (!deck) return;

    const groupedCards = boardCards[boardType]?.reduce((acc, card) => {
      if (!acc[card[groupType]]) acc[card[groupType]] = [card];
      else acc[card[groupType]].push(card);

      return acc;
    }, {} as { [key: string]: DeckCard[] });

    if (!groupedCards) return;
    setGroupedCards(getCardGroupOrder(groupedCards, groupType));
  }, [boardCards, boardType, groupType]);

  return (
    <View className="flex gap-4">
      <Select
        value={DeckCardGalleryGroupTypes.TYPE}
        options={Object.keys(DeckCardGalleryGroupTypes).map((key) => {
          return {
            label: titleCase(key),
            value: (DeckCardGalleryGroupTypes as any)[key],
          };
        })}
        onChange={(type) => setGroupType(type)}
      />

      <View className="flex flex-row flex-wrap gap-4 w-full mt-8">
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
              <View className="block w-full mt-2 lg:columns-3 md:columns-2 columns-1">
                {groupedCards?.map(({ title, cards }) => (
                  <Column key={title} title={title} cards={cards} />
                ))}
              </View>
            ),
          }))}
        />
      </View>
    </View>
  );
}

function Column({ title, cards }: { title: string; cards?: DeckCard[] }) {
  return (
    <View className="w-full break-inside-avoid mb-4">
      <View className="flex flex-row justify-between items-center">
        <Text size="lg" thickness="bold">
          {titleCase(title)}
        </Text>

        <Text>{cards?.length}</Text>
      </View>

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
