import { PatreonTier } from "../patreon/patreon";
import { User } from "./user";

export interface AppAccess {
  showAds: boolean;
  colorAccess: boolean;
  tradeCount: number;
  deckCount: number;
  collectionCount: number;
  kitCount: number;
  folderCount: number;
  tradesThisMonth: number;
}

export function getAccess(user: User): AppAccess {
  if (!user || !user.patreon)
    return {
      showAds: true,
      colorAccess: false,
      tradeCount: 30,
      deckCount: 25,
      collectionCount: 10,
      kitCount: 10,
      folderCount: 10,
      tradesThisMonth: 30,
    };

  if (
    user.patreon.tierName === PatreonTier.EARLY_ADOPTER ||
    user.patreon.tierName === PatreonTier.SUPPORT
  ) {
    return {
      showAds: false,
      colorAccess: true,
      tradeCount: 30,
      deckCount: 100,
      collectionCount: 25,
      kitCount: 25,
      folderCount: 25,
      tradesThisMonth: -1,
    };
  } else {
    return {
      showAds: false,
      colorAccess: true,
      tradeCount: -1,
      deckCount: -1,
      collectionCount: -1,
      kitCount: -1,
      folderCount: -1,
      tradesThisMonth: -1,
    };
  }
}
