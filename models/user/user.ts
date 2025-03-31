export interface User {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  memberSince: string;

  deckCount?: number;
}
