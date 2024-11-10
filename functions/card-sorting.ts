import { MTGRarities } from "@/constants/mtg/mtg-rarity";
import { Card } from "@/models/card/card";
import {
  CardFilters,
  CardsSortedByColor,
  CardsSortedByCost,
  CardsSortedByRarity,
  CardsSortedByType,
} from "@/models/sorted-cards/sorted-cards";
import { MTGCardType, MTGCardTypes } from "../constants/mtg/mtg-types";

export function sortCards(cards: Card[], filters: CardFilters) {
  let sortedCards: Card[] = [];

  if (
    !filters.alphabeticalSort &&
    !filters.priceSort &&
    !filters.manaValueSort
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

export function sortCardsByColor(cards: Card[]): CardsSortedByColor {
  const sortedCards: CardsSortedByColor = {
    white: [],
    blue: [],
    black: [],
    red: [],
    green: [],
    gold: [],
    colorless: [],
    land: [],
  };

  cards.forEach((card) => {
    if (
      card.faces
        ? card.faces?.front.typeLine.includes("Land")
        : card.typeLine.includes("Land")
    ) {
      sortedCards.land.push(card);
    } else if (card.colorIdentity.length > 1) {
      sortedCards.gold.push(card);
    } else if (card.colorIdentity.length === 0) {
      sortedCards.colorless.push(card);
    } else {
      switch (card.colorIdentity[0]) {
        case "W":
          sortedCards.white.push(card);
          return;
        case "U":
          sortedCards.blue.push(card);
          return;
        case "B":
          sortedCards.black.push(card);
          return;
        case "R":
          sortedCards.red.push(card);
          return;
        case "G":
          sortedCards.green.push(card);
          return;
      }
    }
  });

  return sortedCards;
}

export function sortCardsByCost(cards: Card[]): CardsSortedByCost {
  const sortedCards: CardsSortedByCost = {
    zero: [],
    one: [],
    two: [],
    three: [],
    four: [],
    five: [],
    six: [],
    land: [],
  };

  cards.forEach((card) => {
    if (
      card.faces
        ? card.faces?.front.typeLine.includes("Land")
        : card.typeLine.includes("Land")
    ) {
      sortedCards.land.push(card);
    } else if (card.cmc >= 6) sortedCards.six.push(card);
    else {
      switch (card.cmc) {
        case 0:
          sortedCards.zero.push(card);
          return;
        case 1:
          sortedCards.one.push(card);
          return;
        case 2:
          sortedCards.two.push(card);
          return;
        case 3:
          sortedCards.three.push(card);
          return;
        case 4:
          sortedCards.four.push(card);
          return;
        case 5:
          sortedCards.five.push(card);
          return;
      }
    }
  });

  return sortedCards;
}

export function sortCardsByType(cards: Card[]): CardsSortedByType {
  const sortedCards: CardsSortedByType = {
    land: [],
    enchantment: [],
    artifact: [],
    instant: [],
    sorcery: [],
    creature: [],
    planeswalker: [],
    battle: [],
  };

  cards.forEach((card) => {
    const cardType = card.faces?.front
      ? getCardTypeFromTypeLine(card.faces.front.typeLine)
      : getCardTypeFromTypeLine(card.typeLine);

    switch (cardType.toLowerCase()) {
      case MTGCardTypes.CREATURE:
        sortedCards.creature.push(card);
        return;
      case MTGCardTypes.INSTANT:
        sortedCards.instant.push(card);
        return;
      case MTGCardTypes.SORCERY:
        sortedCards.sorcery.push(card);
        return;
      case MTGCardTypes.ARTIFACT:
        sortedCards.artifact.push(card);
        return;
      case MTGCardTypes.ENCHANTMENT:
        sortedCards.enchantment.push(card);
        return;
      case MTGCardTypes.LAND:
        sortedCards.land.push(card);
        return;
      case MTGCardTypes.PLANESWALKER:
        sortedCards.planeswalker.push(card);
        return;
      case MTGCardTypes.BATTLE:
        sortedCards.battle.push(card);
        return;
    }
  });

  return sortedCards;
}

export function sortCardsByRarity(cards: Card[]): CardsSortedByRarity {
  const sortedCards: CardsSortedByRarity = {
    common: [],
    uncommon: [],
    rare: [],
    mythic: [],
  };

  cards.forEach((card) => {
    switch (card.rarity) {
      case MTGRarities.COMMON:
        sortedCards.common.push(card);
        return;
      case MTGRarities.UNCOMMON:
        sortedCards.uncommon.push(card);
        return;
      case MTGRarities.RARE:
        sortedCards.rare.push(card);
        return;
      case MTGRarities.MYTHIC:
        sortedCards.mythic.push(card);
        return;
    }
  });

  return sortedCards;
}

/**
 *
 * @param typeLine the type line for a card as given by scryfall api
 * @returns the creature type as given in CardTypes const (see sorted-cards.ts) or an empty string if the type could not be discerned
 */
function getCardTypeFromTypeLine(typeLine: string): MTGCardType {
  const cardTypeFromTypeLine = typeLine.split("-")[0].toLowerCase();

  // Creature type has priority in multiple types
  if (cardTypeFromTypeLine.includes(MTGCardTypes.CREATURE)) {
    return MTGCardTypes.CREATURE;
  }

  for (const cardType in MTGCardTypes) {
    if (cardTypeFromTypeLine.includes(cardType.toLowerCase()))
      return cardType as MTGCardType;
  }

  // Card type couldn't be found
  return MTGCardTypes.CREATURE;
}
