import { MTGFormat } from "@/constants/mtg/mtg-format";
import { DeckCard } from "../deck";

export interface DeckDTO {
  name?: string;
  description?: string;

  private?: boolean;
  format?: MTGFormat;

  colors?: string;
  featuredArtUrl?: string;

  cards?: DeckCard[];
}
