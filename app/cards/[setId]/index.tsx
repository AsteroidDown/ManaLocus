import CardList from "@/components/cards/card-list";
import BoxHeader from "@/components/ui/box/box-header";
import Placeholder from "@/components/ui/placeholder/placeholder";
import SearchBar from "@/components/ui/search-bar/search-bar";
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
  const [filteredCards, setFilteredCards] = React.useState([] as Card[]);

  const [search, setSearch] = React.useState("");

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

    ScryfallService.getSetCards(set.searchUri).then((cards) => {
      setCards(cards);
      setFilteredCards(cards);
    });
  }, [set]);

  useEffect(() => {
    if (!cards?.length || !search) setFilteredCards(cards);
    else {
      setFilteredCards(
        cards.filter((card) =>
          card.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search]);

  useEffect(() => {
    if (!cards?.length) return;

    filteredCards.forEach((card) => {
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
  }, [filteredCards]);

  if (!set) return;

  return (
    <ScrollView>
      <View className="flex-1 flex gap-6 px-11 py-8 bg-background-100 min-h-[100vh]">
        <BoxHeader
          title={set.name}
          subtitle={set.cardCount + " Cards | Released " + set.releasedAt}
          className="!pb-0"
        />

        <SearchBar
          hideAutocomplete
          search={search}
          searchChange={setSearch}
          placeholder={"Find a " + set.name + " Card"}
        />

        {filteredCards?.length > 0 && <TabBar hideBorder tabs={tabs} />}

        {!filteredCards?.length && (
          <View className="flex flex-1 items-center justify-center max-h-fit">
            <Placeholder
              title="No Cards Found!"
              subtitle="Try searching for something else"
            />
          </View>
        )}
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
