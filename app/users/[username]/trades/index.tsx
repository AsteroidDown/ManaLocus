import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Footer from "@/components/ui/navigation/footer";
import Pagination from "@/components/ui/pagination/pagination";
import Table, { TableColumn } from "@/components/ui/table/table";
import Text from "@/components/ui/text/text";
import Tooltip from "@/components/ui/tooltip/tooltip";
import UserPageContext from "@/contexts/user/user-page.context";
import UserContext from "@/contexts/user/user.context";
import { currency } from "@/functions/text-manipulation";
import { PaginationMeta } from "@/hooks/pagination";
import TradeService from "@/hooks/services/trade.service";
import { TradeSummary } from "@/models/trade/trade";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, useWindowDimensions, View } from "react-native";

export default function UserTradesPage() {
  const { user } = useContext(UserContext);
  const { userPageUser } = useContext(UserPageContext);
  if (!user || !userPageUser) return null;
  if (user?.id !== userPageUser?.id) return null;

  const width = useWindowDimensions().width;

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null as PaginationMeta | null);
  const [loading, setLoading] = useState(false);

  const [trades, setTrades] = useState([] as TradeSummary[]);

  useEffect(() => {
    if (!userPageUser.id) return;
    setLoading(true);

    TradeService.getUserSummaries(
      userPageUser.id,
      {},
      { page, items: 25 }
    ).then((data) => {
      setMeta(data.meta);
      setTrades(data.data);
      setLoading(false);
    });
  }, [userPageUser, page]);

  return (
    <SafeAreaView className="flex-1 w-full h-full bg-background-100">
      <View className="flex my-4 lg:px-16 px-4 min-h-[100dvh]">
        {user.id === userPageUser.id && user.verified && (
          <BoxHeader
            title="Your Trades"
            subtitle="View and manage your trades"
            end={
              <Tooltip
                text={
                  (user?.access?.tradesThisMonth || 0) > 0
                    ? `Trades this month (${user?.tradesThisMonth}/${user?.access?.tradesThisMonth})`
                    : ""
                }
              >
                <Button
                  size="sm"
                  type="outlined"
                  text="Trade"
                  icon={faPlus}
                  onClick={() =>
                    router.push(`users/${userPageUser.name}/trades/new-trade`)
                  }
                  disabled={
                    (user?.access?.tradesThisMonth || 0) > 0 &&
                    (user?.tradesThisMonth || 0) >=
                      (user?.access?.tradesThisMonth || 0)
                  }
                />
              </Tooltip>
            }
          />
        )}

        <Table
          className="mb-2"
          data={trades}
          loading={loading}
          rowClick={(trade: TradeSummary) =>
            router.push(
              `users/${userPageUser.name}/trades/${
                trade.tradedToUser?.name ?? "anonymous"
              }`
            )
          }
          columns={
            [
              {
                title: "User",
                row: (trade) => (
                  <Text>{trade.tradedToUser?.name ?? "Anonymous"}</Text>
                ),
              },
              ...(width > 600
                ? [
                    {
                      center: true,
                      title: "Total Trades",
                      row: (trade) => <Text>{trade.tradeCount}</Text>,
                    } as TableColumn<TradeSummary>,
                  ]
                : []),
              {
                title: "Last Trade",
                row: (trade) => (
                  <Text>{moment(trade.lastTrade).format("MMM Do, YYYY")}</Text>
                ),
              },
              {
                fit: true,
                title: "Total",
                row: (trade) => (
                  <Text
                    weight="semi"
                    action={
                      trade.total < 0
                        ? "danger"
                        : trade.total > 0
                        ? "success"
                        : "default"
                    }
                  >
                    {currency(trade.total / 100)}
                  </Text>
                ),
              },
            ] as TableColumn<TradeSummary>[]
          }
        />

        {meta && <Pagination meta={meta} onChange={setPage} />}
      </View>

      <Footer />
    </SafeAreaView>
  );
}
