import { Card } from "@/models/card/card";
import { CardFilters } from "@/models/sorted-cards/sorted-cards";
import { groupCardsByColor } from "./card-grouping";

export function sortCards(cards: Card[], filters: CardFilters) {
  let sortedCards: Card[] = [];

  if (
    !filters.alphabeticalSort &&
    !filters.priceSort &&
    !filters.manaValueSort &&
    !filters.colorSort
  ) {
    return cards;
  }

  if (filters.alphabeticalSort) {
    sortedCards =
      filters.alphabeticalSort === "ASC"
        ? sortCardsAlphabetically(cards)
        : filters.alphabeticalSort === "DESC"
        ? sortCardsAlphabetically(cards, false)
        : cards;
  }

  if (filters.priceSort) {
    const cardsToSort: Card[] = sortedCards?.length ? sortedCards : cards;

    sortedCards =
      filters.priceSort === "ASC"
        ? sortCardsByPrice(cardsToSort)
        : filters.priceSort === "DESC"
        ? sortCardsByPrice(cardsToSort, false)
        : cardsToSort;
  }

  if (filters.manaValueSort) {
    const cardsToSort: Card[] = sortedCards?.length ? sortedCards : cards;

    sortedCards =
      filters.manaValueSort === "ASC"
        ? sortCardsByManaValue(cardsToSort)
        : filters.manaValueSort === "DESC"
        ? sortCardsByManaValue(cardsToSort, false)
        : cardsToSort;
  }

  if (filters.colorSort) {
    const cardsToSort: Card[] = sortedCards?.length ? sortedCards : cards;

    sortedCards = sortCardsByColor(cardsToSort);
  }

  return sortedCards;
}

export function sortCardsByCollectorNumber(cards: Card[]) {
  return cards.sort(
    (a, b) => Number(a.collectorNumber) - Number(b.collectorNumber)
  );
}

export function sortCardsAlphabetically(cards: Card[], ascending = true) {
  return cards.sort((a, b) =>
    ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );
}

export function sortCardsByManaValue(cards: Card[], ascending = true) {
  return cards.sort((a, b) => (ascending ? a.cmc - b.cmc : b.cmc - a.cmc));
}

export function sortCardsByPrice(
  cards: Card[],
  ascending = true,
  euro = false
) {
  return cards.sort((a, b) =>
    euro
      ? ((a.prices.eur || 0) - (b.prices.eur || 0)) * (ascending ? 1 : -1)
      : ((a.prices.usd || 0) - (b.prices.usd || 0)) * (ascending ? 1 : -1)
  );
}

export function sortCardsByColor(cards: Card[]): Card[] {
  const groupedCards = groupCardsByColor(cards);

  return [
    ...groupedCards.white,
    ...groupedCards.blue,
    ...groupedCards.black,
    ...groupedCards.red,
    ...groupedCards.green,
    ...groupedCards.gold,
    ...groupedCards.colorless,
    ...groupedCards.land,
  ];
}
