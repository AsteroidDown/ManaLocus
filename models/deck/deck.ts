import { MTGColorSymbol } from "@/constants/mtg/mtg-colors";
import { MTGFormat } from "@/constants/mtg/mtg-format";

export interface Deck {
  id: string;
  name: string;
  featuredArtUrl: string;
  format: MTGFormat;
  colors: MTGColorSymbol[];
  cards: string[];
}
