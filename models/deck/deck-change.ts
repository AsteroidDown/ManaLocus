import { BoardType } from "@/contexts/cards/board.context";

export interface DeckChange {
  main: DeckCardChange[];
  side: DeckCardChange[];
  maybe: DeckCardChange[];
  acquire: DeckCardChange[];
}

export interface DeckCardChange {
  id: string;
  deckId: string;

  count: number;
  name: string;
  board: BoardType;
  timestamp: Date;
}
