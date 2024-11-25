import { BoardTypes } from "@/constants/boards";
import { MTGRarities } from "@/constants/mtg/mtg-rarity";
import { MTGCardTypes } from "@/constants/mtg/mtg-types";
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

export type DeckCardGalleryGroupType = "cardType" | "rarity";

export enum DeckCardGalleryGroupTypes {
  TYPE = "cardType",
  RARITY = "rarity",
}

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
      if (!acc[card[groupType]]) acc[card[groupType]] = [card];
      else acc[card[groupType]].push(card);

      return acc;
    }, {} as { [key: string]: DeckCard[] });

    if (!groupedCards) return;
    setGroupedCards(getCardGroupOrder(groupedCards, groupType));
  }, [boardCards, boardType, groupType]);

  function getCardGroupOrder(
    groupedCards: { [key: string]: DeckCard[] },
    groupType: DeckCardGalleryGroupType
  ) {
    if (groupType === DeckCardGalleryGroupTypes.TYPE) {
      return [
        ...(groupedCards[MTGCardTypes.CREATURE]?.length
          ? [{ title: "Creature", cards: groupedCards[MTGCardTypes.CREATURE] }]
          : []),
        ...(groupedCards[MTGCardTypes.INSTANT]?.length
          ? [{ title: "Instant", cards: groupedCards[MTGCardTypes.INSTANT] }]
          : []),
        ...(groupedCards[MTGCardTypes.SORCERY]?.length
          ? [{ title: "Sorcery", cards: groupedCards[MTGCardTypes.SORCERY] }]
          : []),
        ...(groupedCards[MTGCardTypes.ARTIFACT]?.length
          ? [{ title: "Artifact", cards: groupedCards[MTGCardTypes.ARTIFACT] }]
          : []),
        ...(groupedCards[MTGCardTypes.ENCHANTMENT]?.length
          ? [
              {
                title: "Enchantment",
                cards: groupedCards[MTGCardTypes.ENCHANTMENT],
              },
            ]
          : []),
        ...(groupedCards[MTGCardTypes.LAND]?.length
          ? [{ title: "Land", cards: groupedCards[MTGCardTypes.LAND] }]
          : []),
        ...(groupedCards[MTGCardTypes.PLANESWALKER]?.length
          ? [
              {
                title: "Planeswalker",
                cards: groupedCards[MTGCardTypes.PLANESWALKER],
              },
            ]
          : []),
        ...(groupedCards[MTGCardTypes.BATTLE]?.length
          ? [{ title: "Battle", cards: groupedCards[MTGCardTypes.BATTLE] }]
          : []),
      ];
    } else if (groupType === DeckCardGalleryGroupTypes.RARITY) {
      return [
        ...(groupedCards[MTGRarities.COMMON]?.length
          ? [{ title: "Common", cards: groupedCards[MTGRarities.COMMON] }]
          : []),
        ...(groupedCards[MTGRarities.UNCOMMON]?.length
          ? [{ title: "Uncommon", cards: groupedCards[MTGRarities.UNCOMMON] }]
          : []),
        ...(groupedCards[MTGRarities.RARE]?.length
          ? [{ title: "Rare", cards: groupedCards[MTGRarities.RARE] }]
          : []),
        ...(groupedCards[MTGRarities.MYTHIC]?.length
          ? [{ title: "Mythic", cards: groupedCards[MTGRarities.MYTHIC] }]
          : []),
      ];
    }

    return [];
  }

  return (
    <View className="flex gap-4">
      <Select
        value={DeckCardGalleryGroupTypes.TYPE}
        options={Object.values(DeckCardGalleryGroupTypes)}
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
              <View className="flex flex-row flex-wrap gap-4 w-full mt-2 columns-4 z-[-1]">
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
    <View className="flex-1 flex min-w-[256px] z-[-1]">
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
