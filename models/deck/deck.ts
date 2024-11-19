import { MTGColorSymbol } from "@/constants/mtg/mtg-colors";
import { MTGFormat } from "@/constants/mtg/mtg-format";
import { User } from "../user/user";

export interface Deck {
  id: string;

  created: Date;
  updated: Date;

  userId: string;
  user?: User;

  name: string;
  featuredArtUrl: string;

  format: MTGFormat;
  colors: MTGColorSymbol[];

  mainBoard: DeckCardDetails[];
  sideBoard: DeckCardDetails[];
  maybeBoard: DeckCardDetails[];
  acquireBoard: DeckCardDetails[];
}

export interface DeckDTO {
  name?: string;
  featuredArtUrl?: string;

  format?: MTGFormat;
  colors?: MTGColorSymbol[];

  mainBoard?: DeckCardDetails[];
  sideBoard?: DeckCardDetails[];
  maybeBoard?: DeckCardDetails[];
  acquireBoard?: DeckCardDetails[];
}

export interface DeckCardDetails {
  name: string;
  count: number;
  scryfallId: string;
}
