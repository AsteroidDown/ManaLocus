import { TradeCard } from "../trade";

export interface TradeDTO {
  tradingUserId: string;
  tradedToUserId?: string;

  tradingUserCards?: TradeCard[];
  tradedToUserCards?: TradeCard[];

  tradingUserTotal: number;
  tradedToUserTotal: number;

  total: number;
}
