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

    console.log("request");
    ScryfallService.getSetByCode(setId).then((set) => {
      setSet(set);
      ScryfallService.getSetCards(set.searchUri).then((cards) =>
        setCards(cards)
      );
      console.log("got request");
    });
  }, [setId]);

  useEffect(() => {
    if (!cards?.length) return;
    if (baseCards?.length) return;

    console.log("start");

    cards.forEach((card) => {
      if (card.frameEffects?.includes("showcase")) showcaseCards.push(card);
      else if (card.borderColor === "borderless") borderlessCards.push(card);
      else if (card.frameEffects?.includes("extendedart")) {
        extendedArtCards.push(card);
      } else if (card.promo) promoCards.push(card);
      else baseCards.push(card);
    });

    setTabs([
      ...(baseCards?.length
        ? [
            {
              title: "Base",
              children: (
                <CardList
                  subtitle={baseCards.length + " Cards"}
                  cards={baseCards}
                />
              ),
            },
          ]
        : []),
      ...(showcaseCards?.length
        ? [
            {
              title: "Showcase",
              children: (
                <CardList
                  subtitle={showcaseCards.length + " Cards"}
                  cards={showcaseCards}
                />
              ),
            },
          ]
        : []),
      ...(borderlessCards?.length
        ? [
            {
              title: "Borderless",
              children: (
                <CardList
                  subtitle={borderlessCards.length + " Cards"}
                  cards={borderlessCards}
                />
              ),
            },
          ]
        : []),
      ...(extendedArtCards?.length
        ? [
            {
              title: "Extended Art",
              children: (
                <CardList
                  subtitle={extendedArtCards.length + " Cards"}
                  cards={extendedArtCards}
                />
              ),
            },
          ]
        : []),
      ...(promoCards?.length
        ? [
            {
              title: "Promo",
              children: (
                <CardList
                  subtitle={promoCards.length + " Cards"}
                  cards={promoCards}
                />
              ),
            },
          ]
        : []),
    ]);
    console.log("finish");
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
