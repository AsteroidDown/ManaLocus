import { MTGFormat } from "@/constants/mtg/mtg-format";
import { MTGRarity } from "@/constants/mtg/mtg-rarity";
import { MTGCardType } from "@/constants/mtg/mtg-types";
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

  colors: string;
  featuredArtUrl: string;

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
  manaCost: string;
  type: MTGCardType;
  rarity: MTGRarity;
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

  colors?: string;
  featuredArtUrl?: string;

  mainBoard?: DeckCard[];
  sideBoard?: DeckCard[];
  maybeBoard?: DeckCard[];
  acquireBoard?: DeckCard[];
}
