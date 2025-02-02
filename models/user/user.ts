export interface User {
  id: string;
  name: string;
  email: string;
  memberSince: string;

  deckCount?: number;
}
