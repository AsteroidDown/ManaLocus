import CardList from "@/components/cards/card-list";
import BoxHeader from "@/components/ui/box/box-header";
import FilterBar from "@/components/ui/filters/filter-bar";
import Placeholder from "@/components/ui/placeholder/placeholder";
import SearchBar from "@/components/ui/search-bar/search-bar";
import { TabProps } from "@/components/ui/tabs/tab";
import TabBar from "@/components/ui/tabs/tab-bar";
import { filterCards } from "@/functions/card/card-filtering";
import {
  sortCards,
  sortCardsByCollectorNumber,
} from "@/functions/card/card-sorting";
import ScryfallService from "@/hooks/services/scryfall.service";
import { Card } from "@/models/card/card";
import { Set } from "@/models/card/set";
import { CardFilters } from "@/models/sorted-cards/sorted-cards";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";

export default function SetPage() {
  const { setId } = useLocalSearchParams();

  const [set, setSet] = React.useState(null as Set | null);
  const [cards, setCards] = React.useState([] as Card[]);
  const [filteredCards, setFilteredCards] = React.useState([] as Card[]);

  const [search, setSearch] = React.useState("");

  const [filters, setFilters] = React.useState({} as CardFilters);

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
    if (!cards?.length) {
      setFilteredCards(cards);
      return;
    }

    const searchedCards = cards.filter((card) =>
      card.name.toLowerCase().includes(search.toLowerCase())
    );

    let sortedCards: Card[] = [];

    if (
      filters.priceSort ||
      filters.manaValueSort ||
      filters.alphabeticalSort
    ) {
      sortedCards = sortCards(searchedCards, filters);
    } else {
      sortedCards = sortCardsByCollectorNumber(searchedCards);
    }

    setFilteredCards(filterCards(sortedCards, filters));
  }, [search, filters]);

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
      <View className="flex-1 flex gap-6 px-16 py-8 bg-background-100 min-h-[100vh]">
        <BoxHeader
          className="!pb-0"
          title={set.name}
          subtitle={set.cardCount + " Cards | Released " + set.releasedAt}
          end={<FilterBar clear setFilters={setFilters} />}
        />

        <SearchBar
          hideAutocomplete
          search={search}
          searchChange={setSearch}
          placeholder={"Find a " + set.name + " Card"}
        />

        {filteredCards?.length > 0 && <TabBar hideBorder tabs={tabs}></TabBar>}

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
