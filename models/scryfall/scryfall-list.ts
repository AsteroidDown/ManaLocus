import { ScryfallCard } from "./scryfall-card";
import { ScryfallSet } from "./scryfall-set";

export interface ScryfallCardList {
  object: string;
  total_cards: number;
  has_more: boolean;
  next_page: string;
  data: ScryfallCard[];
}

export interface ScryfallSetList {
  object: string;
  total_sets: number;
  has_more: boolean;
  next_page: string;
  data: ScryfallSet[];
}
