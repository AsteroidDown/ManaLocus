import { Card } from "../card/card";
import { User } from "../user/user";

export interface TradeSummary {
  tradingUser: User;
  tradedToUser: User;

  tradeCount: number;
  lastTrade: Date;
  total: number;
}

export interface Trade {
  id: string;

  created: Date;
  updated: Date;
  deleted?: Date;

  tradingUserId: string;
  tradingUser?: User;

  tradedToUserId: string;
  tradedToUser?: User;

  tradingUserCards: TradeCard[];
  tradedToUserCards: TradeCard[];

  tradingUserTotal: number;
  tradedToUserTotal: number;

  total: number;
}

export interface TradeCard {
  id: string;
  userId?: string;
  tradeId: string;
  scryfallId: string;

  card: Card;
  count: number;
  price: number;
  foil: boolean;
}
