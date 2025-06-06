import Box from "@/components/ui/box/box";
import Button from "@/components/ui/button/button";
import SearchBar from "@/components/ui/search-bar/search-bar";
import { SideBoardLimit } from "@/constants/mtg/limits";
import BoardContext from "@/contexts/cards/board.context";
import StoredCardsContext from "@/contexts/cards/stored-cards.context";
import ToastContext from "@/contexts/ui/toast.context";
import {
  getLocalStorageStoredCards,
  saveLocalStorageCard,
} from "@/functions/local-storage/card-local-storage";
import ScryfallService from "@/hooks/services/scryfall.service";
import { Card } from "@/models/card/card";
import { faEllipsisV, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "expo-router";
import React, { useContext, useState } from "react";
import { View } from "react-native";
import Dropdown from "../ui/dropdown/dropdown";
import CardDetailedPreview from "./card-detailed-preview";
import CardImage from "./card-image";
import CardPrints from "./card-prints";

export interface CardSearchProps {
  hideCardPreview?: boolean;
  linkToCardPage?: boolean;
  className?: string;

  searchAction?: (search?: string) => void;
}

export default function CardSearch({
  hideCardPreview,
  linkToCardPage,
  className,
  searchAction,
}: CardSearchProps) {
  const { addToast } = useContext(ToastContext);
  const { board } = useContext(BoardContext);
  const { setStoredCards } = useContext(StoredCardsContext);

  const [search, onSearchChange] = useState("");

  const [card, setCard] = useState(undefined as Card | undefined);
  const [searchedCards, setSearchedCards] = useState([] as Card[]);

  const [noSearchResults, setNoSearchResults] = useState(false);
  const [noSearchResultsTimer, setNoSearchResultsTimer] =
    useState<NodeJS.Timeout>();
  const [noResultsSearch, setNoResultsSearch] = useState("");

  const [addMultipleOpen, setAddMultipleOpen] = useState(false);

  const searchedCardsPlaceholder = Array(5).fill(undefined);

  const sideboardCount = getLocalStorageStoredCards("side").reduce(
    (acc, storedCard) => acc + storedCard.count,
    0
  );

  function findCards(query?: string) {
    ScryfallService.findCards(query ?? search).then((response) => {
      const cards = response.cards;

      // If a no search results message is currently rendered, clear the disappear message timeout
      if (noSearchResultsTimer) {
        clearTimeout(noSearchResultsTimer);
        setNoSearchResults(false);
      }

      // One result returned, auto-populate the card-detailed-preview with it
      if (cards.length === 1) setCard(cards[0]);

      if (cards.length === 0) {
        // Show "No search results" message for a short period of time
        setNoSearchResults(true);
        const noResultsTimer = setTimeout(() => {
          setNoSearchResults(false);
        }, 2500);

        setNoSearchResultsTimer(noResultsTimer);
        setNoResultsSearch(search);
      } else {
        setSearchedCards(cards);
      }
    });
  }

  function saveCard(card?: Card, count = 1) {
    if (!card) return;

    setAddMultipleOpen(false);

    const storedCards = saveLocalStorageCard(card, count, board);
    if (storedCards) setStoredCards(storedCards);

    addToast({
      action: "success",
      title: `Card${count > 1 ? "s" : ""} Added!`,
      subtitle: `${count} ${card.name} ${
        count > 1 ? "have" : "has"
      } been added to the ${board} board`,
    });
  }

  return (
    <View
      className={`flex lg:flex-row flex-wrap z-100 ${className} ${
        searchedCards?.length ? "gap-4" : ""
      }`}
    >
      <View
        className={`flex-1 flex lg:min-w-[360px] max-w-full ${
          searchedCards?.length ? "gap-4" : ""
        }`}
      >
        <SearchBar
          search={search}
          searchChange={onSearchChange}
          noSearchResults={noSearchResults}
          searchAction={(query) =>
            searchAction ? searchAction(query) : findCards(query)
          }
        />

        <Box
          className={`flex-[2] !bg-background-100 border-background-200 rounded-xl z-[-1] transition-all duration-300 ${
            !searchedCards?.length
              ? "max-h-0 !p-0"
              : "lg:min-h-[350px] min-h-[200px] h-full !px-4 !py-2 border-2"
          }`}
        >
          <View className="h-full rounded-xl overflow-x-auto overflow-y-hidden">
            {!searchedCards?.length && (
              <View className="flex flex-row flex-1 gap-4">
                {searchedCardsPlaceholder.map((_, index) => (
                  <CardImage key={index} />
                ))}
              </View>
            )}

            {searchedCards?.length > 0 && (
              <View className="flex flex-row gap-4 h-full">
                {searchedCards.map((card, index) => (
                  <View key={card.scryfallId + index}>
                    {linkToCardPage ? (
                      <Link href={`cards/${card.set}/${card.collectorNumber}`}>
                        <CardImage
                          card={card}
                          onClick={() => setCard(card)}
                          className="lg:max-h-[350px] !max-h-[200px]"
                        />
                      </Link>
                    ) : (
                      <CardImage
                        card={card}
                        onClick={() => setCard(card)}
                        className="lg:!max-h-[350px] !max-h-[200px] lg:!max-w-[250px] !max-w-[142px] lg:!min-w-[228px] !min-w-[142px]"
                      />
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {noSearchResults && (
            <View className="absolute bottom-2 flex w-full justify-center text-red-500 font-bold items-center transition-all ease-in-out duration-1000">
              No cards found matching: "{noResultsSearch}"
            </View>
          )}
        </Box>
      </View>

      {!hideCardPreview && card && (
        <View
          className={`${
            card ? "max-w-[1000px] max-h-[600px]" : "max-w-0 max-h-0"
          } rounded-xl border-2 border-background-200 transition-all duration-300 overflow-hidden`}
        >
          <Box className="!bg-background-100">
            <CardDetailedPreview hidePrices card={card}>
              <View className="flex flex-row justify-center items-end w-full gap-2">
                <CardPrints card={card} setCard={setCard} />

                <View className="flex-1 flex flex-row">
                  <Button
                    squareRight
                    size="sm"
                    text="Add"
                    type="outlined"
                    className="flex-1"
                    icon={faPlus}
                    disabled={
                      !card ||
                      (board === "side" && sideboardCount >= SideBoardLimit)
                    }
                    onClick={() => saveCard(card)}
                  />

                  <Button
                    squareLeft
                    size="sm"
                    type="outlined"
                    icon={faEllipsisV}
                    disabled={
                      !card ||
                      (board === "side" && sideboardCount >= SideBoardLimit)
                    }
                    onClick={() => setAddMultipleOpen(true)}
                  />

                  <View className="-mx-px">
                    <Dropdown
                      expanded={addMultipleOpen}
                      setExpanded={setAddMultipleOpen}
                    >
                      <Box className="flex justify-start items-start !p-0 mt-5 border-2 border-primary-300 !bg-background-95 overflow-hidden">
                        <Button
                          start
                          square
                          size="sm"
                          type="clear"
                          text="Add 2"
                          className="w-full"
                          icon={faPlus}
                          disabled={
                            !card ||
                            (board === "side" &&
                              sideboardCount >= SideBoardLimit - 1)
                          }
                          onClick={() => saveCard(card, 2)}
                        />

                        <Button
                          start
                          square
                          size="sm"
                          type="clear"
                          text="Add 3"
                          className="w-full"
                          icon={faPlus}
                          disabled={
                            !card ||
                            (board === "side" &&
                              sideboardCount >= SideBoardLimit - 2)
                          }
                          onClick={() => saveCard(card, 3)}
                        />

                        <Button
                          start
                          square
                          size="sm"
                          type="clear"
                          text="Add 4"
                          className="w-full"
                          icon={faPlus}
                          disabled={
                            !card ||
                            (board === "side" &&
                              sideboardCount >= SideBoardLimit - 3)
                          }
                          onClick={() => saveCard(card, 4)}
                        />
                      </Box>
                    </Dropdown>
                  </View>
                </View>
              </View>
            </CardDetailedPreview>
          </Box>
        </View>
      )}
    </View>
  );
}
