import {
  MTGColor,
  MTGColorMap,
  MTGColorSymbol,
} from "../../constants/mtg/mtg-colors";
import { MTGRarity } from "../../constants/mtg/mtg-rarity";
import { MTGCardType } from "../../constants/mtg/mtg-types";
import { Card } from "../../models/card/card";
import { CardFilters } from "../../models/sorted-cards/sorted-cards";

const baseColors: MTGColorSymbol[] = ["W", "U", "B", "R", "G"];

export function filterCards(cards: Card[], filters?: CardFilters) {
  return cards.reduce((acc, card) => {
    if (!filters) acc.push(card);
    else if (filterCard(card, filters)) acc.push(card);
    return acc;
  }, [] as Card[]);
}

export function filterCard(card: Card, filters: CardFilters) {
  return !(
    (filters.colorFilter?.length &&
      filterCardByColor(card, filters.colorFilter)) ||
    (filters.typeFilter?.length &&
      filterCardByType(card, filters.typeFilter)) ||
    (filters.rarityFilter?.length &&
      filterCardByRarity(card, filters.rarityFilter))
  );
}

export function filterCardByColor(card: Card, colors: MTGColor[]) {
  const filterColors = colors?.map((color) => MTGColorMap.get(color));

  // Filter colorless
  if (filterColors.includes("C") && card.colorIdentity.length === 0) {
    return false;
  }

  // Filter mono colored cards
  const monoColored = filterColors?.includes("1");
  if (
    monoColored &&
    card.colorIdentity.length === 1 &&
    (filterColors?.length === 1
      ? true
      : card.colorIdentity.some((color) => filterColors?.includes(color)))
  ) {
    return false;
  }

  const filteredBaseColors = baseColors.filter((color) =>
    filterColors.includes(color)
  );

  // Filter multi colored cards
  const multiColored = filterColors?.includes("M");
  if (multiColored) {
    // If multiple colors are selected
    if (filteredBaseColors.length > 1) {
      if (
        card.colorIdentity.length === filteredBaseColors.length &&
        card.colorIdentity.every((color) => filteredBaseColors?.includes(color))
      ) {
        return false;
      }
      // If one color is selected
    } else if (filteredBaseColors.length === 1) {
      if (
        card.colorIdentity.length > 1 &&
        card.colorIdentity.some((color) => filteredBaseColors?.includes(color))
      ) {
        return false;
      }
      // If no colors are selected
    } else {
      if (card.colorIdentity.length > 1) return false;
    }
  }

  // Filter base color cards with no mono or multi
  if (
    !monoColored &&
    !multiColored &&
    card.colorIdentity.some((color) => filteredBaseColors?.includes(color))
  ) {
    return false;
  }

  return true;
}

export function filterCardByType(card: Card, types: MTGCardType[]) {
  return !types.some((type) =>
    card.faces?.front
      ? card.faces.front.typeLine.toLowerCase().includes(type)
      : card.typeLine.toLowerCase().includes(type)
  );
}

export function filterCardByRarity(card: Card, rarities: MTGRarity[]) {
  return !rarities.some((rarity) => card.rarity === rarity);
}
