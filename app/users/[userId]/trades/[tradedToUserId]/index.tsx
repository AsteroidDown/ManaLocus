import SettleUpModal from "@/components/trades/settle-up-modal";
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
import UserService from "@/hooks/services/user.service";
import { Trade } from "@/models/trade/trade";
import { User } from "@/models/user/user";
import {
  faArrowLeft,
  faPlus,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
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
  const [tradesTotal, setTradesTotal] = useState(0);

  const [settleUpOpen, setSettleUpOpen] = useState(false);

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
    if (!tradedToUserId || typeof tradedToUserId !== "string") return;

    TradeService.getTotalBetweenUsers(
      userPageUser.id,
      tradedToUserId === "anonymous" ? "0" : tradedToUserId
    ).then((response) => setTradesTotal(response?.total ?? 0));
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
          <BoxHeader
            title={`Your Trades ${
              tradedToUser?.name ? `with ${tradedToUser.name}` : ""
            }`}
            subtitle={
              tradedToUser ? (
                <>
                  {tradesTotal === 0 ? (
                    `You and ${tradedToUser.name} are even!`
                  ) : (
                    <>
                      {`${tradesTotal > 0 ? tradedToUser.name : "You"} owe${
                        tradesTotal > 0 ? "s You" : `${tradedToUser.name}`
                      }: `}
                      <Text action={tradesTotal > 0 ? "success" : "danger"}>
                        {currency(tradesTotal / 100)}
                      </Text>
                    </>
                  )}
                </>
              ) : (
                ""
              )
            }
            start={
              <Button
                rounded
                size="lg"
                type="clear"
                action="default"
                className="-mx-2"
                icon={faArrowLeft}
                onClick={() => router.push(`users/${userPageUser.id}/trades`)}
              />
            }
            end={
              <View className="flex flex-row gap-2">
                {tradesTotal !== 0 && (
                  <Button
                    type="outlined"
                    text="Settle Up"
                    icon={faReceipt}
                    onClick={() => setSettleUpOpen(true)}
                  />
                )}

                <Button
                  type="outlined"
                  text="New Trade"
                  className="self-end"
                  icon={faPlus}
                  onClick={() =>
                    router.push(
                      `users/${userPageUser.id}/trades/new-trade${
                        tradedToUserId
                          ? `?tradedToUserId=${tradedToUser?.id}`
                          : ""
                      }`
                    )
                  }
                />
              </View>
            }
          />
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

      {tradedToUser && (
        <SettleUpModal
          open={settleUpOpen}
          setOpen={setSettleUpOpen}
          total={tradesTotal}
          user={userPageUser}
          tradedToUser={tradedToUser}
          setPage={setPage}
        />
      )}
    </SafeAreaView>
  );
}
