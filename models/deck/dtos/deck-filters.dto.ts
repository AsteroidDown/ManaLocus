import { MTGFormat } from "@/constants/mtg/mtg-format";

export interface DeckFiltersDTO {
  search?: string | null;
  deckFormat?: MTGFormat | null;
  cardNames?: string[] | null;
  sort?: DeckSortType | null;
  includePrivate?: string | null;
}

export type DeckSortType =
  | "created"
  | "-created"
  | "updated"
  | "-updated"
  | "favorites"
  | "-favorites"
  | "views"
  | "-views";

export enum DeckSortTypes {
  CREATED = "-created",
  CREATED_REVERSE = "created",
  UPDATED = "-updated",
  UPDATED_REVERSE = "updated",
  FAVORITES = "-favorites",
  FAVORITES_REVERSE = "favorites",
  VIEWS = "-views",
  VIEWS_REVERSE = "views",
}
