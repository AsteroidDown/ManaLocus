import { BoardType } from "@/constants/boards";
import { MTGFormat } from "@/constants/mtg/mtg-format";
import { Card } from "../card/card";
import { Dashboard } from "../dashboard/dashboard";
import { User } from "../user/user";

export interface Deck {
  id: string;

  created: Date;
  updated: Date;

  userId: string;
  user?: User;

  name: string;
  description?: string;
  bracket?: number;
  bracketGuess?: number;

  favorites: number;
  views: number;

  private: boolean;
  format: MTGFormat;

  colors: string;
  featuredArtUrl: string;

  main: Card[];
  side: Card[];
  maybe: Card[];
  acquire: Card[];
  trade: Card[];

  dashboard?: Dashboard;

  commander?: Card;
  partner?: Card;

  isKit?: boolean;
  isCollection?: boolean;
  inProgress?: boolean;
}

export interface DeckCard {
  deckId?: string;
  scryfallId: string;
  name: string;
  count: number;
  board: BoardType;
}
