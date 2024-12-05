import { MTGFormat } from "@/constants/mtg/mtg-format";

export interface DeckFiltersDTO {
  search?: string | null;
  deckFormat?: MTGFormat | null;

  scryfallIds?: string[] | null;
}
