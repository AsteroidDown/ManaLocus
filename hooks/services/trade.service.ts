import { mapDatabaseUser } from "@/functions/mapping/user-mapping";
import { TradeFiltersDto } from "@/models/trade/dtos/trade-filters.dto";
import { TradeDTO } from "@/models/trade/dtos/trade.dto";
import { Trade, TradeSummary } from "@/models/trade/trade";
import API from "../api-methods/api-methods";
import {
  DefaultPagination,
  PaginatedResponse,
  PaginationOptions,
} from "../pagination";

async function getUserSummaries(
  userId: string,
  dto: TradeFiltersDto,
  pagination?: PaginationOptions
): Promise<PaginatedResponse<TradeSummary>> {
  if (!pagination) pagination = DefaultPagination;
  return await API.get(`trades/${userId}/`, { ...dto, ...pagination }).then(
    (response) => ({
      ...response,
      data: response.data.map((trade: TradeSummary) => ({
        ...trade,
        tradingUser: mapDatabaseUser(trade.tradingUser),
        tradedToUser: trade?.tradedToUser
          ? mapDatabaseUser(trade.tradedToUser)
          : null,
      })),
    })
  );
}

async function getBetweenUsers(
  userId: string,
  tradedToUserId: string,
  pagination?: PaginationOptions
): Promise<PaginatedResponse<Trade>> {
  if (!pagination) pagination = DefaultPagination;
  return await API.get(`trades/${userId}/${tradedToUserId}/`, {
    ...pagination,
  });
}

async function getTotalBetweenUsers(
  userId: string,
  tradedToUserId: string
): Promise<{ total: number }> {
  return await API.get(`trades/${userId}/${tradedToUserId}/total/`);
}

async function get(
  userId: string,
  tradedToUserId: string,
  tradeId: string
): Promise<Trade> {
  return await API.get(`trades/${userId}/${tradedToUserId}/${tradeId}/`);
}

async function create(userId: string, dto: TradeDTO): Promise<Trade> {
  return await API.post(`trades/${userId}/`, { ...dto });
}

async function update(userId: string, tradeId: string, name: string) {
  return await API.patch(`trades/${userId}/${tradeId}/`, { name });
}

async function remove(userId: string, tradeId: string) {
  return await API.delete(`trades/${userId}/${tradeId}/`);
}

const TradeService = {
  get,
  getUserSummaries,
  getBetweenUsers,
  getTotalBetweenUsers,
  create,
  update,
  remove,
};

export default TradeService;
