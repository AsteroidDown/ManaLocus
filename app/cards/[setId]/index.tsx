import CardList from "@/components/cards/card-list";
import BoxHeader from "@/components/ui/box/box-header";
import { TabProps } from "@/components/ui/tabs/tab";
import TabBar from "@/components/ui/tabs/tab-bar";
import ScryfallService from "@/hooks/scryfall.service";
import { Card } from "@/models/card/card";
import { Set } from "@/models/card/set";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";

export default function SetPage() {
  const { setId } = useLocalSearchParams();

  const [set, setSet] = React.useState(null as Set | null);
  const [cards, setCards] = React.useState([] as Card[]);

  const [tabs, setTabs] = React.useState([] as TabProps[]);

  const baseCards: Card[] = [];
  const showcaseCards: Card[] = [];
  const borderlessCards: Card[] = [];
  const extendedArtCards: Card[] = [];
  const promoCards: Card[] = [];

  useEffect(() => {
    if (typeof setId !== "string" || baseCards?.length) return;

    ScryfallService.getSetByCode(setId).then((set) => setSet(set));
  }, [setId]);

  useEffect(() => {
    if (!set) return;

    ScryfallService.getSetCards(set.searchUri).then((cards) => setCards(cards));
  }, [set]);

  useEffect(() => {
    if (!cards?.length) return;
    if (baseCards?.length) return;

    cards.forEach((card) => {
      if (
        card.faces?.front.frameEffects?.includes("showcase") ||
        card.frameEffects?.includes("showcase")
      ) {
        showcaseCards.push(card);
      } else if (card.borderColor === "borderless") borderlessCards.push(card);
      else if (
        card.faces?.front.frameEffects?.includes("extendedart") ||
        card.frameEffects?.includes("extendedart")
      ) {
        extendedArtCards.push(card);
      } else if (card.promo) promoCards.push(card);
      else baseCards.push(card);
    });

    setTabs([
      ...(baseCards?.length ? getTabContent("Base", baseCards) : []),
      ...(showcaseCards?.length
        ? getTabContent("Showcase", showcaseCards)
        : []),
      ...(borderlessCards?.length
        ? getTabContent("Borderless", borderlessCards)
        : []),
      ...(extendedArtCards?.length
        ? getTabContent("Extended Art", extendedArtCards)
        : []),
      ...(promoCards?.length ? getTabContent("Promo", promoCards) : []),
    ]);
  }, [cards]);

  if (!set) return;

  return (
    <ScrollView>
      <View className="flex flex-1 px-11 py-8 bg-background-100 min-h-[100vh]">
        <BoxHeader
          title={set.name}
          subtitle={set.cardCount + " Cards"}
          className="mb-4"
        />

        <TabBar hideBorder tabs={tabs} />
      </View>
    </ScrollView>
  );
}

function getTabContent(title: string, cards: Card[]) {
  return [
    {
      title,
      children: <CardList subtitle={cards.length + " Cards"} cards={cards} />,
    },
  ];
}
