import { getCardType } from "@/functions/cards/card-information";
import { titleCase } from "@/functions/text-manipulation";
import { PaginationMeta } from "@/hooks/pagination";
import { Card } from "@/models/card/card";
import { DeckViewType } from "@/models/deck/dtos/deck-filters.dto";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Pagination from "../ui/pagination/pagination";
import Table from "../ui/table/table";
import Text from "../ui/text/text";
import CardImage from "./card-image";
import CardText from "./card-text";

export interface CardListProps {
  cards: Card[];
  includeSet?: boolean;
  viewType?: DeckViewType;
}

export default function CardList({
  cards,
  includeSet,
  viewType,
}: CardListProps) {
  const { setId } = useLocalSearchParams();

  const [page, setPage] = useState(1);
  const [items, setItems] = useState(50);
  const [meta, setMeta] = useState({
    page,
    items,
    totalItems: cards.length,
    totalPages: Math.ceil(cards.length / items),
  } as PaginationMeta | null);

  const [loadIndex, setLoadIndex] = useState(0);

  const [viewedCards, setViewedCards] = useState([] as Card[]);

  useEffect(() => {
    if (!cards?.length) return;

    setMeta({
      page,
      items,
      totalItems: cards.length,
      totalPages: Math.ceil(cards.length / items),
    });
    setViewedCards(cards.slice((page - 1) * items, page * items));
  }, [cards, page]);

  return (
    <View className="flex mt-4 w-full">
      {viewType === DeckViewType.CARD ? (
        <View className="flex flex-row flex-wrap lg:justify-start justify-center gap-2">
          {cards.map((card, index) => (
            <CardImage
              card={card}
              key={card.scryfallId + index}
              shouldLoad={loadIndex >= index}
              onClick={() =>
                router.push(
                  `cards/${setId ?? card.set}/${card.collectorNumber}`
                )
              }
              onLoad={() => {
                if (index < loadIndex) return;
                setLoadIndex(index + 1);
              }}
            />
          ))}
        </View>
      ) : (
        <View className="flex">
          <Table
            data={viewedCards}
            rowClick={(card) =>
              router.push(`cards/${setId ?? card.set}/${card.collectorNumber}`)
            }
            columns={[
              {
                fit: true,
                row: (card) => (
                  <Text>
                    {includeSet ? card.set.toUpperCase() + " " : ""}{" "}
                    {card.collectorNumber}
                  </Text>
                ),
              },
              {
                title: "Name",
                row: (card) => <Text>{card.name}</Text>,
              },
              {
                title: "Mana Cost",
                row: (card) => <CardText text={card.manaCost}></CardText>,
              },
              {
                title: "Type",
                row: (card) => <Text>{titleCase(getCardType(card))}</Text>,
              },
            ]}
          />
          {meta && meta.totalItems > 0 && (
            <Pagination meta={meta} onChange={(page) => setPage(page)} />
          )}
        </View>
      )}
    </View>
  );
}
