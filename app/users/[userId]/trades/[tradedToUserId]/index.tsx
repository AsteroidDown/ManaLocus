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
import UserService from "@/hooks/services/user.service";
import { Trade } from "@/models/trade/trade";
import { User } from "@/models/user/user";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView, View } from "react-native";

export default function TradedToUserPage() {
  const { user } = useContext(UserContext);
  const { userPageUser } = useContext(UserPageContext);
  if (!user || !userPageUser) return null;
  if (user?.id !== userPageUser?.id) return null;

  const { tradedToUserId } = useLocalSearchParams();

  const { setBodyHeight } = useContext(BodyHeightContext);

  const containerRef = useRef<View>(null);

  const [tradedToUser, setTradedToUser] = useState(null as User | null);

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null as PaginationMeta | null);
  const [loading, setLoading] = useState(false);

  const [trades, setTrades] = useState([] as Trade[]);

  useEffect(() => {
    if (
      !tradedToUserId ||
      tradedToUserId === "anonymous" ||
      typeof tradedToUserId !== "string"
    ) {
      return;
    }

    setLoading(true);

    UserService.get(tradedToUserId).then((user) => setTradedToUser(user));
  }, [tradedToUserId]);

  useEffect(() => {
    if (!tradedToUser && tradedToUserId !== "anonymous") return;

    setLoading(true);

    TradeService.getBetweenUsers(userPageUser.id, tradedToUser?.id ?? "0", {
      page,
      items: 25,
    }).then((response) => {
      setMeta(response.meta);
      setTrades(
        response.data.map((trade) => {
          if (trade.tradedToUser?.id === userPageUser.id) {
            const tradingUserTotal = trade.tradedToUserTotal;
            trade.tradedToUserTotal = trade.tradingUserTotal;
            trade.tradingUserTotal = tradingUserTotal;

            trade.total *= -1;
          }

          return trade;
        })
      );
      setLoading(false);
    });
  }, [tradedToUser, page]);

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
          <View className="flex flex-row justify-between items-center gap-4 mb-6">
            <Text size="xl" thickness="semi">
              Your Trades{" "}
              {tradedToUser?.name ? `with ${tradedToUser.name}` : ""}
            </Text>

            <Button
              type="outlined"
              text="New Trade"
              className="self-end"
              icon={faPlus}
              onClick={() =>
                router.push(`users/${userPageUser.id}/trades/new-trade`)
              }
            />
          </View>
        )}

        {loading ? (
          <LoadingTable />
        ) : (
          <Table
            className="mb-2"
            data={trades}
            rowClick={(trade: Trade) =>
              router.push(
                `users/${userPageUser.id}/trades/${
                  tradedToUser?.id ?? "anonymous"
                }/${trade.id}`
              )
            }
            columns={
              [
                {
                  title: "Your Total",
                  row: (trade) => (
                    <Text>{currency(trade.tradingUserTotal / 100)}</Text>
                  ),
                },
                {
                  title: "Their Total",
                  row: (trade) => (
                    <Text>{currency(trade.tradedToUserTotal / 100)}</Text>
                  ),
                },
                {
                  title: "Total",
                  row: (trade) => (
                    <Text
                      thickness="semi"
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
                {
                  fit: true,
                  title: "Date",
                  row: (trade) => (
                    <Text>{moment(trade.created).format("MMM Do, YYYY")}</Text>
                  ),
                },
              ] as TableColumn<Trade>[]
            }
          />
        )}

        {meta && <Pagination meta={meta} onChange={setPage} />}
      </View>
    </SafeAreaView>
  );
}
