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

  private: boolean;
  format: MTGFormat;

  colors: string;
  featuredArtUrl: string;

  main: Card[];
  side: Card[];
  maybe: Card[];
  acquire: Card[];

  dashboard?: Dashboard;

  commander?: Card;
}

export interface DeckCard {
  deckId?: string;
  scryfallId: string;
  name: string;
  count: number;
  board: BoardType;
}
