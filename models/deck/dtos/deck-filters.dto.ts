import { BoardType } from "@/constants/boards";
import { MTGFormat } from "@/constants/mtg/mtg-format";

export interface DeckFiltersDTO {
  search?: string | null;
  deckFormat?: MTGFormat | null;
  sort?: DeckSortType | null;
  includePrivate?: string | null;
  commander?: string | null;
  partner?: string | null;

  cardNames?: string[] | null;
  board?: BoardType | null;
  exclusiveCardSearch?: boolean | null;

  userDecks?: boolean | null;
  onlyKits?: boolean | null;
  excludeIds?: string[] | null;
  includeIds?: string[] | null;
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

export enum DeckViewType {
  LIST = "list",
  CARD = "card",
}
