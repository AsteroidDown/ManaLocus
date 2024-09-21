import Box from "@/components/ui/box/box";
import Button from "@/components/ui/button/button";
import SearchBar from "@/components/ui/search-bar/search-bar";
import { ActionColor } from "@/constants/ui/colors";
import StoredCardsContext from "@/contexts/cards/stored-cards.context";
import { saveLocalStorageCard } from "@/functions/local-storage/card-local-storage";
import ScryfallService from "@/hooks/scryfall.service";
import { Card } from "@/models/card/card";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useState } from "react";
import { View } from "react-native";
import CardDetailedPreview from "./card-detailed-preview";
import CardImage from "./card-image";
import CardPrints from "./card-prints";

export default function CardSearch() {
  const { maybeBoard, setStoredCards } = useContext(StoredCardsContext);

  const [search, onSearchChange] = useState("");

  const [card, setCard] = useState(undefined as Card | undefined);
  const [searchedCards, setSearchedCards] = useState([] as Card[]);

  const [buttonText, setButtonText] = useState("Add Card");
  const [buttonAction, setButtonAction] = useState("primary" as ActionColor);

  const [noSearchResults, setNoSearchResults] = useState(false);
  const [noSearchResultsTimer, setNoSearchResultsTimer] = useState<NodeJS.Timeout>();
  const [badSearch, setBadSearch] = useState("");
  const [newSearch, setNewSearch] = useState(false);

  const searchedCardsPlaceholder = Array(5).fill(undefined);

  function findCards() {
    ScryfallService.findCards(search).then((cards) => {
      setSearchedCards(cards);

      // if a no search results message is currently rendered, clear the disappear timeout
      if (noSearchResultsTimer) {
        clearTimeout(noSearchResultsTimer);
        setNoSearchResults(false);
      }

      // one result returned, auto-populate the card-detailed-preview with it
      if (cards.length === 1) setCard(cards[0]);

      // no results
      if (cards.length === 0) {
        // show "No search results" message for a short period of time
        setNoSearchResults(true);
        const noResultsTimer = setTimeout(() => {
          setNoSearchResults(false);
        }, 5000);

        setNoSearchResultsTimer(noResultsTimer);
        setBadSearch(search);
      }
      else {
        // toggle card animation condition so cards fade in on each new search
        setNewSearch(false);
        setTimeout(() => {
          setNewSearch(true);
        }, 20);
      }
    });
  }

  function saveCard(card?: Card) {
    if (!card) return;

    const storedCards = saveLocalStorageCard(card, maybeBoard);
    if (storedCards) setStoredCards(storedCards);

    setButtonText("Card Added!");
    setButtonAction("success");

    setTimeout(() => {
      setButtonText("Add Card");
      setButtonAction("primary");
    }, 3000);
  }

  return (
    <View className="flex flex-row flex-wrap gap-4">
      <View className="flex flex-1 gap-4 min-w-[360px]">
        <SearchBar
          search={search}
          searchAction={findCards}
          onSearchChange={onSearchChange}
        />

        <Box className="flex-[2] min-h-[350px] h-full">
          <View className={`${noSearchResults ? "overflow-x-hidden" : "overflow-x-auto"} overflow-y-hidden h-full`}>
            {noSearchResults && (
                <View className={`flex h-full w-full justify-center text-primary-500 font-bold items-center ${noSearchResults ? "animate-fadeIn" : ""}`}>
                  No cards found matching: "{badSearch}"
                </View>
            )}
            {!searchedCards?.length && (
              <View className={`flex flex-row gap-4 h-full ${!noSearchResults ? "animate-fadeIn" : ""}`}>
                {searchedCardsPlaceholder.map((_, index) => (
                  <CardImage key={index} />
                ))}
              </View>
            )}

            {searchedCards?.length && (
              <View className={`flex flex-row gap-4 h-full ${newSearch ? "animate-fadeIn": ""}`}>
                {searchedCards.map((card, index) => (
                  <CardImage
                    card={card}
                    key={card.id + index}
                    onClick={() => setCard(card)}
                  />
                ))}
              </View>
            )}
          </View>
        </Box>
      </View>

      <CardDetailedPreview card={card}>
        <CardPrints card={card} setCard={setCard} />

        <Button
          icon={faPlus}
          disabled={!card}
          text={buttonText}
          action={buttonAction}
          onClick={() => saveCard(card)}
        />
      </CardDetailedPreview>
    </View>
  );
}
