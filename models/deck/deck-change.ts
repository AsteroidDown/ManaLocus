import { BoardType } from "@/constants/boards";

export interface DeckChange {
  main: DeckCardChange[];
  side: DeckCardChange[];
  maybe: DeckCardChange[];
  acquire: DeckCardChange[];
  trade: DeckCardChange[];
}

export interface DeckCardChange {
  id: string;
  deckId: string;

  count: number;
  name: string;
  board: BoardType;
  timestamp: Date;
}
