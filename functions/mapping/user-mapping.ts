import { User } from "@/models/user/user";

export function mapDatabaseUser(user: any): User {
  return {
    id: user.id,
    name: user.username,
    email: user.email,
    verified: user?.verified,
    memberSince: user.date_joined,
    deckCount: user?.deckCount,
    deckFavorites: user?.deckFavorites,
    deckViews: user?.deckViews,
    kitCount: user?.kitCount,
    collectionCount: user?.collectionCount,
    folderCount: user?.folderCount,
    tradesThisMonth: user?.tradesThisMonth,
    patreon: user?.patreon,
  };
}
