import { MTGFormat } from "@/constants/mtg/mtg-format";

export interface DeckFiltersDTO {
  search?: string | null;
  deckFormat?: MTGFormat | null;
  cardNames?: string[] | null;
  sort?: DeckSortType | null;
}

export type DeckSortType = "created" | "-created" | "updated" | "-updated";

export enum DeckSortTypes {
  CREATED = "created",
  CREATED_REVERSE = "-created",
  UPDATED = "updated",
  UPDATED_REVERSE = "-updated",
}
