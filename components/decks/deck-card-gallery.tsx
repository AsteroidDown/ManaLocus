import { BoardTypes } from "@/constants/boards";
import {
  groupCardsByCost,
  groupCardsByRarity,
  groupCardsByType,
} from "@/functions/card-grouping";
import {
  sortCardsAlphabetically,
  sortCardsByManaValue,
  sortCardsByPrice,
} from "@/functions/card-sorting";
import { titleCase } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";
import { faList, faShop } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Linking, Pressable, View } from "react-native";
import CardDetailedPreview from "../cards/card-detailed-preview";
import CardImage from "../cards/card-image";
import CardText from "../cards/card-text";
import Button from "../ui/button/button";
import Divider from "../ui/divider/divider";
import Select from "../ui/input/select";
import Modal from "../ui/modal/modal";
import Text from "../ui/text/text";

export type DeckCardGalleryViewType = "list" | "card";

export enum DeckCardGalleryViewTypes {
  LIST = "list",
  CARD = "card",
}

export type DeckCardGallerySortType = "name" | "mana-value" | "price";

export enum DeckCardGallerySortTypes {
  NAME = "name",
  MANA_VALUE = "mana-value",
  PRICE = "price",
}

export type DeckCardGalleryGroupType = "type" | "rarity" | "cost";

export enum DeckCardGalleryGroupTypes {
  TYPE = "type",
  RARITY = "rarity",
  COST = "cost",
}

export interface DeckCardGalleryProps {
  deck: Deck;
}

export default function DeckCardGallery({ deck }: DeckCardGalleryProps) {
  const [viewType, setViewType] = React.useState(DeckCardGalleryViewTypes.LIST);
  const [sortType, setSortType] = React.useState(DeckCardGallerySortTypes.NAME);
  const [boardType, setBoardType] = React.useState(BoardTypes.MAIN);
  const [groupType, setGroupType] = React.useState(
    DeckCardGalleryGroupTypes.TYPE
  );

  const [boardCards, setBoardCards] = React.useState(
    {} as { [key: string]: Card[] }
  );

  const [groupedCards, setGroupedCards] = React.useState(
    [] as { title: string; cards: Card[] }[]
  );

  useEffect(() => {
    if (!deck) return;

    setBoardCards({
      main: sortCardsAlphabetically(deck.main),
      side: sortCardsAlphabetically(deck.side),
      maybe: sortCardsAlphabetically(deck.maybe),
      acquire: sortCardsAlphabetically(deck.acquire),
    });

    setBoardType(BoardTypes.MAIN);
  }, [deck]);

  useEffect(() => {
    if (!deck) return;

    const sortedCards =
      sortType === DeckCardGallerySortTypes.MANA_VALUE
        ? sortCardsByManaValue(deck[boardType])
        : sortType === DeckCardGallerySortTypes.PRICE
        ? sortCardsByPrice(deck[boardType])
        : sortCardsAlphabetically(deck[boardType]);

    if (groupType === DeckCardGalleryGroupTypes.RARITY) {
      const rarityGroupedCards = groupCardsByRarity(sortedCards);

      setGroupedCards([
        ...(rarityGroupedCards.common?.length
          ? [{ title: "Common", cards: rarityGroupedCards.common }]
          : []),
        ...(rarityGroupedCards.uncommon?.length
          ? [{ title: "Uncommon", cards: rarityGroupedCards.uncommon }]
          : []),
        ...(rarityGroupedCards.rare?.length
          ? [{ title: "Rare", cards: rarityGroupedCards.rare }]
          : []),
        ...(rarityGroupedCards.mythic?.length
          ? [{ title: "Mythic", cards: rarityGroupedCards.mythic }]
          : []),
      ]);
    } else if (groupType === DeckCardGalleryGroupTypes.COST) {
      const costGroupedCards = groupCardsByCost(sortedCards);

      setGroupedCards([
        ...(costGroupedCards.zero?.length
          ? [{ title: "Zero", cards: costGroupedCards.zero }]
          : []),
        ...(costGroupedCards.one?.length
          ? [{ title: "One", cards: costGroupedCards.one }]
          : []),
        ...(costGroupedCards.two?.length
          ? [{ title: "Two", cards: costGroupedCards.two }]
          : []),
        ...(costGroupedCards.three?.length
          ? [{ title: "Three", cards: costGroupedCards.three }]
          : []),
        ...(costGroupedCards.four?.length
          ? [{ title: "Four", cards: costGroupedCards.four }]
          : []),
        ...(costGroupedCards.five?.length
          ? [{ title: "Five", cards: costGroupedCards.five }]
          : []),
        ...(costGroupedCards.six?.length
          ? [{ title: "Six", cards: costGroupedCards.six }]
          : []),
      ]);
    } else {
      const typeGroupedCards = groupCardsByType(sortedCards);

      setGroupedCards([
        ...(typeGroupedCards.creature?.length
          ? [{ title: "Creature", cards: typeGroupedCards.creature }]
          : []),
        ...(typeGroupedCards.instant?.length
          ? [{ title: "Instant", cards: typeGroupedCards.instant }]
          : []),
        ...(typeGroupedCards.sorcery?.length
          ? [{ title: "Sorcery", cards: typeGroupedCards.sorcery }]
          : []),
        ...(typeGroupedCards.artifact?.length
          ? [{ title: "Artifact", cards: typeGroupedCards.artifact }]
          : []),
        ...(typeGroupedCards.enchantment?.length
          ? [
              {
                title: "Enchantment",
                cards: typeGroupedCards.enchantment,
              },
            ]
          : []),
        ...(typeGroupedCards.planeswalker?.length
          ? [
              {
                title: "Planeswalker",
                cards: typeGroupedCards.planeswalker,
              },
            ]
          : []),
        ...(typeGroupedCards.battle?.length
          ? [{ title: "Battle", cards: typeGroupedCards.battle }]
          : []),
        ...(typeGroupedCards.land?.length
          ? [{ title: "Land", cards: typeGroupedCards.land }]
          : []),
      ]);
    }
  }, [boardCards, sortType, groupType, boardType]);

  return (
    <View className="flex gap-4" style={{ zIndex: 10 }}>
      <View className="flex flex-row flex-wrap gap-2" style={{ zIndex: 10 }}>
        <View className="flex-1 flex flex-row gap-2" style={{ zIndex: 10 }}>
          <Select
            label="View"
            value={viewType}
            onChange={(type) => setViewType(type)}
            options={Object.keys(DeckCardGalleryViewTypes).map((key) => {
              return {
                label: titleCase(key),
                value: (DeckCardGalleryViewTypes as any)[key],
              };
            })}
          />

          <Select
            label="Sort"
            value={sortType}
            onChange={(type) => setSortType(type)}
            options={Object.values(DeckCardGallerySortTypes).map((key) => ({
              label: titleCase(key.replace("-", " ")),
              value: key,
            }))}
          />
        </View>

        <View className="flex-1 flex flex-row gap-2" style={{ zIndex: 10 }}>
          <Select
            label="Grouping"
            value={groupType}
            onChange={(type) => setGroupType(type)}
            options={Object.keys(DeckCardGalleryGroupTypes).map((key) => {
              return {
                label: titleCase(key),
                value: (DeckCardGalleryGroupTypes as any)[key],
              };
            })}
          />

          <Select
            label="Board"
            value={boardType}
            onChange={(board) => setBoardType(board)}
            options={Object.values(BoardTypes).map((board) => ({
              label: titleCase(board),
              value: board,
            }))}
          />
        </View>
      </View>

      <View className="block w-full mt-2 lg:columns-3 md:columns-2 columns-1 gap-8">
        {groupedCards?.map(({ title, cards }) => (
          <Column key={title} title={title} viewType={viewType} cards={cards} />
        ))}
      </View>
    </View>
  );
}

function Column({
  title,
  cards,
  viewType,
}: {
  title: string;
  cards?: Card[];
  viewType: DeckCardGalleryViewType;
}) {
  return (
    <View className="w-full break-inside-avoid mb-6">
      <View className="flex flex-row justify-between items-center px-2">
        <Text size="lg" thickness="bold">
          {titleCase(title)}
        </Text>

        <Text>{cards?.length}</Text>
      </View>

      <Divider thick className="!border-background-200 my-1" />

      <View className="flex gap-0.5">
        {cards?.map((card, index) => (
          <DeckCard
            key={index}
            card={card}
            last={index === cards.length - 1}
            viewType={viewType}
          />
        ))}
      </View>
    </View>
  );
}

function DeckCard({
  card,
  last,
  viewType,
}: {
  card: Card;
  last: boolean;
  viewType: DeckCardGalleryViewType;
}) {
  const navigation = useNavigation();

  const [open, setOpen] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState(-1);

  const cardCount = Array(card.count).fill(undefined);

  return (
    <>
      {viewType === DeckCardGalleryViewTypes.LIST && (
        <Pressable
          className="flex flex-row gap-2 justify-between items-center px-2 py-0.5 rounded-full hover:bg-primary-200 transition-all duration-300"
          onPress={() => setOpen(true)}
        >
          <View className="flex-1 flex flex-row items-center gap-2">
            <Text>{card.count}</Text>
            <Text truncate thickness="medium">
              {card.name}
            </Text>
          </View>

          <CardText text={card.manaCost} />
        </Pressable>
      )}

      {viewType === DeckCardGalleryViewTypes.CARD &&
        cardCount.map((_, index) => (
          <Pressable
            key={index}
            onPress={() => setOpen(true)}
            onPointerEnter={() => setHoveredIndex(index)}
            onPointerLeave={() => setHoveredIndex(-1)}
            className={`${hoveredIndex === index ? "z-[100]" : "z-0"} ${
              !(last && index === card.count - 1) ? "max-h-8" : ""
            } max-w-fit mx-auto`}
          >
            <CardImage card={card} />
          </Pressable>
        ))}

      <View className="-mt-0.5">
        <Modal open={open} setOpen={setOpen}>
          <CardDetailedPreview card={card} className="!p-0">
            <View className="flex flex-row gap-2">
              <Button
                size="sm"
                action="info"
                className="flex-1"
                icon={faShop}
                text={`$${card.prices?.usd}`}
                onClick={async () =>
                  card.priceUris?.tcgplayer &&
                  (await Linking.openURL(card.priceUris.tcgplayer))
                }
              />

              <Button
                size="sm"
                action="info"
                className="flex-1"
                icon={faShop}
                text={`€${card.prices?.eur}`}
                onClick={async () =>
                  card.priceUris?.cardmarket &&
                  (await Linking.openURL(card.priceUris.cardmarket))
                }
              />
            </View>

            <Button
              text="More Details"
              className="flex-1 w-full"
              icon={faList}
              // onClick={() =>
              //   navigation.navigate(`cards/${card.set}/${card.collectorNumber}`)
              // }
            />
          </CardDetailedPreview>
        </Modal>
      </View>
    </>
  );
}
