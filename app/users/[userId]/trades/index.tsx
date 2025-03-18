import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Pagination from "@/components/ui/pagination/pagination";
import LoadingTable from "@/components/ui/table/loading-table";
import Table, { TableColumn } from "@/components/ui/table/table";
import Text from "@/components/ui/text/text";
import BodyHeightContext from "@/contexts/ui/body-height.context";
import UserPageContext from "@/contexts/user/user-page.context";
import UserContext from "@/contexts/user/user.context";
import { currency } from "@/functions/text-manipulation";
import { PaginationMeta } from "@/hooks/pagination";
import TradeService from "@/hooks/services/trade.service";
import { TradeSummary } from "@/models/trade/trade";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView, useWindowDimensions, View } from "react-native";

export default function UserFoldersPage() {
  const { user } = useContext(UserContext);
  const { userPageUser } = useContext(UserPageContext);
  if (!user || !userPageUser) return null;
  if (user?.id !== userPageUser?.id) return null;

  const { setBodyHeight } = useContext(BodyHeightContext);

  const containerRef = useRef<View>(null);

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
      <View
        ref={containerRef}
        className="flex my-4"
        onLayout={() =>
          containerRef.current?.measureInWindow((_x, _y, _width, height) =>
            setBodyHeight(height)
          )
        }
      >
        {user.id === userPageUser.id && (
          <BoxHeader
            title="Your Trades"
            end={
              <Button
                type="outlined"
                text="New Trade"
                className="self-end"
                icon={faPlus}
                onClick={() =>
                  router.push(`users/${userPageUser.id}/trades/new-trade`)
                }
              />
            }
          />
        )}

        {loading ? (
          <LoadingTable />
        ) : (
          <Table
            className="mb-2"
            data={trades}
            rowClick={(trade: TradeSummary) =>
              router.push(
                `users/${userPageUser.id}/trades/${
                  trade.tradedToUser?.id ?? "anonymous"
                }`
              )
            }
            columns={
              [
                {
                  title: "User",
                  row: (trade) => (
                    <Text>
                      {(trade.tradedToUser as any)?.username ?? "Anonymous"}
                    </Text>
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
                    <Text>
                      {moment(trade.lastTrade).format("MMM Do, YYYY")}
                    </Text>
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
        )}

        {meta && <Pagination meta={meta} onChange={setPage} />}
      </View>
    </SafeAreaView>
  );
}
