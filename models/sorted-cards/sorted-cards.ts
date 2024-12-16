import { MTGColor } from "../../constants/mtg/mtg-colors";
import { MTGRarity } from "../../constants/mtg/mtg-rarity";
import { MTGCardType } from "../../constants/mtg/mtg-types";
import { SortType } from "../../constants/sorting";
import { Card } from "../card/card";

export type CardFilterSortType = "cost" | "color" | "type";

export interface CardsSortedByColor {
  white: Card[];
  blue: Card[];
  black: Card[];
  red: Card[];
  green: Card[];
  gold: Card[];
  colorless: Card[];
  land: Card[];
}

export interface CardsSortedByCost {
  zero: Card[];
  one: Card[];
  two: Card[];
  three: Card[];
  four: Card[];
  five: Card[];
  six: Card[];
  land: Card[];
}

export interface CardsSortedByType {
  creature: Card[];
  instant: Card[];
  sorcery: Card[];
  artifact: Card[];
  enchantment: Card[];
  planeswalker: Card[];
  battle: Card[];
  land: Card[];
}

export interface CardsSortedByRarity {
  common: Card[];
  uncommon: Card[];
  rare: Card[];
  mythic: Card[];
}

export interface CardFilters {
  colorFilter?: MTGColor[];
  typeFilter?: MTGCardType[];
  rarityFilter?: MTGRarity[];
  manaValueSort?: SortType;
  priceSort?: SortType;
  alphabeticalSort?: SortType;
  colorSort?: boolean;
}
