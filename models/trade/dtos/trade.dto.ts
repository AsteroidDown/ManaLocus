import { Card } from "@/models/card/card";

export interface TradeDTO {
  tradingUserId: string;
  tradedToUserId?: string;

  tradingUserCollectionId?: string;
  tradedToUserCollectionId?: string;

  tradingUserCards?: TradeCardDTO[];
  tradedToUserCards?: TradeCardDTO[];

  tradingUserTotal: number;
  tradedToUserTotal: number;

  total: number;
}

export interface TradeCardDTO {
  userId?: string;
  scryfallId?: string;

  card?: Card;
  name?: string;
  count: number;
  price?: number;
  foil: boolean;
}
