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

  private: boolean;
  format: MTGFormat;

  featuredArtUrl: string;
  colors: MTGColorSymbol[];

  mainBoard: DeckCard[];
  sideBoard: DeckCard[];
  maybeBoard: DeckCard[];
  acquireBoard: DeckCard[];
}

export interface DeckCard {
  deckId?: string;
  scryfallId: string;
  name: string;
  count: number;
  castingCost: string;
  frontImageUrl?: string;
  backImageUrl?: string;
  tcgPlayerUrl?: string;
  cardMarketUrl?: string;
}

export interface DeckDTO {
  name?: string;
  description?: string;

  private?: boolean;
  format?: MTGFormat;

  featuredArtUrl?: string;
  colors?: MTGColorSymbol[];

  mainBoard?: DeckCard[];
  sideBoard?: DeckCard[];
  maybeBoard?: DeckCard[];
  acquireBoard?: DeckCard[];
}
