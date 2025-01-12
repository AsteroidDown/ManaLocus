import Divider from "@/components/ui/divider/divider";
import Text from "@/components/ui/text/text";
import { groupCardsByColorMulti } from "@/functions/cards/card-grouping";
import { getCountOfCards } from "@/functions/cards/card-stats";
import { titleCase } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import React from "react";
import { View } from "react-native";
import CardItem from "./card-item";

export interface CardItemGalleryColumnCardGrouping {
  title: string;
  cards: Card[];
  count: number;
}

export interface CardItemGalleryColumnProps {
  title: string;
  cards: Card[];
  groups?: string[];
  hideImages?: boolean;
  groupMulticolored?: boolean;
  itemsExpanded?: number;
  setItemExpanded: React.Dispatch<React.SetStateAction<number>>;
}

export default function CardItemGalleryColumn({
  title,
  cards,
  groups,
  hideImages = false,
  groupMulticolored = false,
  itemsExpanded,
  setItemExpanded,
}: CardItemGalleryColumnProps) {
  const cardCount = getCountOfCards(cards);

  const [cardGroupings, setCardGroupings] = React.useState(
    [] as CardItemGalleryColumnCardGrouping[] | null
  );

  React.useEffect(() => {
    if (!cards?.length || !groupMulticolored) return;

    const cardGroupings = [] as CardItemGalleryColumnCardGrouping[];
    const groupedCards = groupCardsByColorMulti(cards);

    Object.keys(groupedCards).forEach((key: string) => {
      cardGroupings.push({
        title: titleCase(key),
        cards: (groupedCards as any)[key],
        count:
          (groupedCards as any)[key]?.reduce(
            (acc: number, card: Card) => (acc += card.count),
            0
          ) || 0,
      });
    });

    setCardGroupings(cardGroupings);
  }, [cards, groupMulticolored]);

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

      {!groupMulticolored && (
        <View className={`flex gap-[3px]`}>
          {cards?.map((card, index) => (
            <CardItem
              key={card.scryfallId + index}
              card={card}
              groups={groups}
              hideImage={hideImages}
              itemsExpanded={itemsExpanded}
              setItemsExpanded={setItemExpanded}
            />
          ))}
        </View>
      )}

      {groupMulticolored && (cardGroupings?.length || 0) > 0 && (
        <View className="flex gap-[3px]">
          {cardGroupings?.map((group, index) => (
            <View key={index + group.title} className="mt-1">
              {group.title !== title && (
                <View className="flex flex-row justify-between items-center px-2">
                  <Text thickness="semi">{titleCase(group.title)}</Text>

                  <Text>{group.count}</Text>
                </View>
              )}

              {group.title !== title && <Divider className="my-1" />}

              <View
                className={`${
                  group.title === title ? "-mt-1" : ""
                } flex gap-0.5`}
              >
                {group.cards.map((card, cardIndex) => (
                  <CardItem
                    key={card.scryfallId + cardIndex}
                    card={card}
                    groups={groups}
                    hideImage={hideImages}
                    itemsExpanded={itemsExpanded}
                    setItemsExpanded={setItemExpanded}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
