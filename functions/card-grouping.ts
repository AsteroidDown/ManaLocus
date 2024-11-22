import { MTGColorSymbols } from "@/constants/mtg/mtg-colors";
import { MTGRarities } from "@/constants/mtg/mtg-rarity";
import { MTGCardTypes } from "@/constants/mtg/mtg-types";
import { Card } from "@/models/card/card";
import {
  CardsSortedByColor,
  CardsSortedByCost,
  CardsSortedByRarity,
  CardsSortedByType,
} from "@/models/sorted-cards/sorted-cards";
import { getCardType } from "./card-information";

export function groupCardsByColor(cards: Card[]): CardsSortedByColor {
  const groupedCards: CardsSortedByColor = {
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
      groupedCards.land.push(card);
    } else if (card.colorIdentity.length > 1) {
      groupedCards.gold.push(card);
    } else if (card.colorIdentity.length === 0) {
      groupedCards.colorless.push(card);
    } else {
      switch (card.colorIdentity[0]) {
        case MTGColorSymbols.WHITE:
          groupedCards.white.push(card);
          return;
        case MTGColorSymbols.BLUE:
          groupedCards.blue.push(card);
          return;
        case MTGColorSymbols.BLACK:
          groupedCards.black.push(card);
          return;
        case MTGColorSymbols.RED:
          groupedCards.red.push(card);
          return;
        case MTGColorSymbols.GREEN:
          groupedCards.green.push(card);
          return;
      }
    }
  });

  return groupedCards;
}

export function groupCardsByCost(cards: Card[]): CardsSortedByCost {
  const groupedCards: CardsSortedByCost = {
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
      groupedCards.land.push(card);
    } else if (card.cmc >= 6) groupedCards.six.push(card);
    else {
      switch (card.cmc) {
        case 0:
          groupedCards.zero.push(card);
          return;
        case 1:
          groupedCards.one.push(card);
          return;
        case 2:
          groupedCards.two.push(card);
          return;
        case 3:
          groupedCards.three.push(card);
          return;
        case 4:
          groupedCards.four.push(card);
          return;
        case 5:
          groupedCards.five.push(card);
          return;
      }
    }
  });

  return groupedCards;
}

export function groupCardsByType(cards: Card[]): CardsSortedByType {
  const groupedCards: CardsSortedByType = {
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
    const cardType = getCardType(card);

    switch (cardType.toLowerCase()) {
      case MTGCardTypes.CREATURE:
        groupedCards.creature.push(card);
        return;
      case MTGCardTypes.INSTANT:
        groupedCards.instant.push(card);
        return;
      case MTGCardTypes.SORCERY:
        groupedCards.sorcery.push(card);
        return;
      case MTGCardTypes.ARTIFACT:
        groupedCards.artifact.push(card);
        return;
      case MTGCardTypes.ENCHANTMENT:
        groupedCards.enchantment.push(card);
        return;
      case MTGCardTypes.LAND:
        groupedCards.land.push(card);
        return;
      case MTGCardTypes.PLANESWALKER:
        groupedCards.planeswalker.push(card);
        return;
      case MTGCardTypes.BATTLE:
        groupedCards.battle.push(card);
        return;
    }
  });

  return groupedCards;
}

export function groupCardsByRarity(cards: Card[]): CardsSortedByRarity {
  const groupedCards: CardsSortedByRarity = {
    common: [],
    uncommon: [],
    rare: [],
    mythic: [],
  };

  cards.forEach((card) => {
    switch (card.rarity) {
      case MTGRarities.COMMON:
        groupedCards.common.push(card);
        return;
      case MTGRarities.UNCOMMON:
        groupedCards.uncommon.push(card);
        return;
      case MTGRarities.RARE:
        groupedCards.rare.push(card);
        return;
      case MTGRarities.MYTHIC:
        groupedCards.mythic.push(card);
        return;
    }
  });

  return groupedCards;
}
