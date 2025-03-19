import CardList from "@/components/cards/card-list";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import FilterBar from "@/components/ui/filters/filter-bar";
import Placeholder from "@/components/ui/placeholder/placeholder";
import SearchBar from "@/components/ui/search-bar/search-bar";
import { TabProps } from "@/components/ui/tabs/tab";
import TabBar from "@/components/ui/tabs/tab-bar";
import BodyHeightContext from "@/contexts/ui/body-height.context";
import LoadingContext from "@/contexts/ui/loading.context";
import { filterCards } from "@/functions/cards/card-filtering";
import {
  sortCards,
  sortCardsByCollectorNumber,
} from "@/functions/cards/card-sorting";
import ScryfallService from "@/hooks/services/scryfall.service";
import { Card } from "@/models/card/card";
import { Set } from "@/models/card/set";
import { DeckViewType } from "@/models/deck/dtos/deck-filters.dto";
import { CardFilters } from "@/models/sorted-cards/sorted-cards";
import { faBorderAll, faList } from "@fortawesome/free-solid-svg-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useRef } from "react";
import { Image, SafeAreaView, View } from "react-native";

export default function SetPage() {
  const { setId } = useLocalSearchParams();
  const { setLoading } = useContext(LoadingContext);
  const { setBodyHeight } = useContext(BodyHeightContext);

  const containerRef = useRef<SafeAreaView>(null);

  const [set, setSet] = React.useState(null as Set | null);
  const [cards, setCards] = React.useState([] as Card[]);
  const [filteredCards, setFilteredCards] = React.useState([] as Card[]);

  const [search, setSearch] = React.useState("");

  const [filters, setFilters] = React.useState({} as CardFilters);
  const [viewType, setViewType] = React.useState(DeckViewType.CARD);

  const [tabs, setTabs] = React.useState([] as TabProps[]);

  const baseCards: Card[] = [];
  const showcaseCards: Card[] = [];
  const borderlessCards: Card[] = [];
  const extendedArtCards: Card[] = [];
  const fullArtCards: Card[] = [];
  const promoCards: Card[] = [];
  const specialPromos: Card[] = [];

  useEffect(() => {
    if (typeof setId !== "string" || baseCards?.length) return;
    setLoading(true);

    ScryfallService.getSetByCode(setId).then((set) => setSet(set));
  }, [setId]);

  useEffect(() => {
    if (!set) return;

    ScryfallService.getSetCards(set.searchUri).then((cards) => {
      setCards(cards);
      setLoading(false);
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
  }, [cards, search, filters]);

  useEffect(() => {
    if (!cards?.length) return;

    filteredCards.forEach((card) => {
      if (
        card.frameEffects?.includes("showcase") ||
        card.faces?.front.frameEffects?.includes("showcase")
      ) {
        showcaseCards.push(card);
      } else if (card.borderColor === "borderless") borderlessCards.push(card);
      else if (
        card.frameEffects?.includes("extendedart") ||
        card.faces?.front.frameEffects?.includes("extendedart")
      ) {
        extendedArtCards.push(card);
      } else if (
        card.frameEffects?.includes("fullart") ||
        card.faces?.front.frameEffects?.includes("fullart")
      ) {
        fullArtCards.push(card);
      } else if (card.promo) promoCards.push(card);
      else if (card.promoTypes?.length) specialPromos.push(card);
      else baseCards.push(card);
    });

    setTabs([
      ...(baseCards?.length ? getTabContent("Base", baseCards, viewType) : []),
      ...(showcaseCards?.length
        ? getTabContent("Showcase", showcaseCards, viewType)
        : []),
      ...(borderlessCards?.length
        ? getTabContent("Borderless", borderlessCards, viewType)
        : []),
      ...(extendedArtCards?.length
        ? getTabContent("Extended Art", extendedArtCards, viewType)
        : []),
      ...(fullArtCards?.length
        ? getTabContent("Full Art", fullArtCards, viewType)
        : []),
      ...(promoCards?.length
        ? getTabContent("Promo", promoCards, viewType)
        : []),
      ...(specialPromos?.length
        ? getTabContent("Special Promos", specialPromos, viewType)
        : []),
    ]);
  }, [filteredCards, viewType]);

  if (!set) return;

  return (
    <SafeAreaView
      ref={containerRef}
      onLayout={() =>
        containerRef.current?.measureInWindow((_x, _y, _width, height) =>
          setBodyHeight(height)
        )
      }
    >
      <View className="flex-1 flex gap-6 lg:px-16 px-4 py-8 bg-background-100 min-h-[100dvh]">
        <BoxHeader
          className="!pb-0"
          title={set.name}
          subtitle={set.cardCount + " Cards | Released " + set.releasedAt}
          start={
            <Image
              source={{ uri: set.iconSvgUri }}
              className="h-10 w-10 fill-white invert-[1]"
            />
          }
          end={<FilterBar clear setFilters={setFilters} />}
        />

        <SearchBar
          hideAutocomplete
          search={search}
          searchChange={setSearch}
          placeholder={`Search ${set.name}`}
        />

        {filteredCards?.length > 0 && (
          <TabBar hideBorder tabs={tabs}>
            <View className="flex flex-row">
              <Button
                squareRight
                icon={faBorderAll}
                type={viewType === DeckViewType.CARD ? "default" : "outlined"}
                onClick={() => setViewType(DeckViewType.CARD)}
              />

              <Button
                squareLeft
                icon={faList}
                type={viewType === DeckViewType.LIST ? "default" : "outlined"}
                onClick={() => setViewType(DeckViewType.LIST)}
              />
            </View>
          </TabBar>
        )}

        {!filteredCards?.length && (
          <View className="flex flex-1 items-center justify-center max-h-fit">
            <Placeholder
              title="No Cards Found!"
              subtitle="Try searching for something else"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function getTabContent(title: string, cards: Card[], viewType: DeckViewType) {
  return [
    {
      title,
      children: <CardList cards={cards} viewType={viewType} />,
    },
  ];
}
