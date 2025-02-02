import { User } from "@/models/user/user";

export function mapDatabaseUser(user: any): User {
  return {
    id: user.id,
    name: user.username,
    email: user.email,
    deckCount: user.deckCount,
    memberSince: user.date_joined,
  };
}
