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
  description?: string;
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
  description?: string;
  featuredArtUrl?: string;

  format?: MTGFormat;
  colors?: MTGColorSymbol[];

  mainBoard?: DeckCardDetails[];
  sideBoard?: DeckCardDetails[];
  maybeBoard?: DeckCardDetails[];
  acquireBoard?: DeckCardDetails[];
}

export interface DeckCardDetails {
  deckId: string;
  name: string;
  count: number;
  scryfallId: string;
}
