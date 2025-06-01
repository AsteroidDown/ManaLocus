import { Patreon } from "../patreon/patreon";

export interface User {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  memberSince: string;

  deckCount?: number;
  deckFavorites?: number;
  deckViews?: number;

  patreon?: Patreon;
}
