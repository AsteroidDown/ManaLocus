import { MTGFormat } from "@/constants/mtg/mtg-format";

export interface DeckFiltersDTO {
  deckFormat?: MTGFormat | null;
}
