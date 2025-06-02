import { Patreon } from "../patreon/patreon";
import { AppAccess } from "./access";

export interface User {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  memberSince: string;

  deckCount?: number;
  deckFavorites?: number;
  deckViews?: number;
  kitCount?: number;
  collectionCount?: number;
  folderCount?: number;
  tradesThisMonth?: number;

  patreon?: Patreon;

  access?: AppAccess;
}
