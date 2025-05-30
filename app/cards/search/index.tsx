import CardList from "@/components/cards/card-list";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Footer from "@/components/ui/navigation/footer";
import Placeholder from "@/components/ui/placeholder/placeholder";
import SearchBar from "@/components/ui/search-bar/search-bar";
import Text from "@/components/ui/text/text";
import ScryfallService from "@/hooks/services/scryfall.service";
import { Card } from "@/models/card/card";
import { DeckViewType } from "@/models/deck/dtos/deck-filters.dto";
import {
  faArrowCircleDown,
  faArrowLeft,
  faBorderAll,
  faList,
  faRotate,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";

export default function CardSearchPage() {
  const { query } = useLocalSearchParams();

  const [search, setSearch] = useState((query as string) ?? "");
  const [viewType, setViewType] = useState(DeckViewType.CARD);

  const [cards, setCards] = useState([] as Card[]);
  const [total, setTotal] = useState(0);
  const [nextPage, setNextPage] = useState(undefined as string | undefined);

  const [loading, setLoading] = useState(false);

  useEffect(() => findCards(), [query]);

  function findCards() {
    if (query !== search) router.push(`cards/search?query=${search}`);
    else {
      setLoading(true);

      ScryfallService.findCards(search).then((response) => {
        if (response.total === 1) {
          router.push(
            `cards/${response.cards[0].set}/${response.cards[0].collectorNumber}`
          );
        }

        setLoading(false);
        setTotal(response.total);
        setCards(response.cards);
        setNextPage(response.nextPage);
      });
    }
  }

  function loadMore() {
    if (!nextPage) return;

    setLoading(true);

    ScryfallService.findCardsByPage(nextPage).then((response) => {
      setCards([...cards, ...response.cards]);
      setNextPage(response.nextPage);
      setLoading(false);
    });
  }

  return (
    <SafeAreaView>
      <View className="flex flex-1 gap-4 lg:px-16 px-4 py-4 min-h-[100dvh] bg-background-100">
        <BoxHeader
          className="!pb-0"
          title="Find Cards"
          subtitle="Search for cards using Scryfall's powerful search engine"
          start={
            <Button
              rounded
              size="lg"
              type="clear"
              action="default"
              className="-ml-2 -mr-3"
              icon={faArrowLeft}
              onClick={() => router.push(`cards`)}
            />
          }
          end={
            <View className="flex flex-row">
              <Button
                size="sm"
                squareRight
                icon={faBorderAll}
                type={viewType === DeckViewType.CARD ? "default" : "outlined"}
                onClick={() => setViewType(DeckViewType.CARD)}
              />

              <Button
                size="sm"
                squareLeft
                icon={faList}
                type={viewType === DeckViewType.LIST ? "default" : "outlined"}
                onClick={() => setViewType(DeckViewType.LIST)}
              />
            </View>
          }
        />

        <View className="z-[100]">
          <SearchBar
            search={search}
            searchChange={setSearch}
            searchAction={findCards}
          />
        </View>

        <View className="mt-4 z-[0]">
          {(cards?.length ?? 0) > 0 && (
            <Text size="xs" className="!text-dark-600 -mt-4">
              Showing {cards.length} of {total} cards found using search query "
              {query}"
            </Text>
          )}

          {!cards?.length &&
            (loading ? (
              <Button disabled type="clear" text="Loading..." icon={faRotate} />
            ) : (
              <Placeholder
                icon={faSearch}
                title="No Cards Found"
                subtitle="Try adjusting your search filters to find cards!"
              />
            ))}

          <CardList cards={cards} viewType={viewType} />
        </View>

        {nextPage && (
          <Button
            size="sm"
            type="outlined"
            text="Load More"
            className="max-w-fit ml-auto"
            icon={loading ? faRotate : faArrowCircleDown}
            disabled={loading}
            onClick={loadMore}
          />
        )}
      </View>

      <Footer />
    </SafeAreaView>
  );
}
