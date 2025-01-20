export interface DeckFolder {
  id: string;
  name: string;
  userId: string;
  created: Date;
  updated: Date;
  deckIds: string[];
}
