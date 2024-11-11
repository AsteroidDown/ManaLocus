import { MTGColorSymbol } from "@/constants/mtg/mtg-colors";
import { MTGFormat } from "@/constants/mtg/mtg-format";
import { User } from "../user/user";

export interface Deck {
  id: string;
  userId: string;
  user?: User;
  name: string;
  featuredArtUrl: string;
  format: MTGFormat;
  colors: MTGColorSymbol[];
  cards: string[];
}
