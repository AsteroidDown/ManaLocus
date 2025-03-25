import SettleUpModal from "@/components/trades/settle-up-modal";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Footer from "@/components/ui/navigation/footer";
import Pagination from "@/components/ui/pagination/pagination";
import LoadingTable from "@/components/ui/table/loading-table";
import Table, { TableColumn } from "@/components/ui/table/table";
import Text from "@/components/ui/text/text";
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
import { useContext, useEffect, useState } from "react";
import { SafeAreaView, useWindowDimensions, View } from "react-native";

export default function TradedToUserPage() {
  const { user } = useContext(UserContext);
  const { userPageUser } = useContext(UserPageContext);
  if (!user || !userPageUser) return null;
  if (user?.id !== userPageUser?.id) return null;

  const { tradedToUserId } = useLocalSearchParams();

  const width = useWindowDimensions().width;

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
      <View className="flex my-4 lg:px-16 px-4 min-h-[100dvh]">
        {user.id === userPageUser.id && (
          <BoxHeader
            title={`Your Trades ${
              tradedToUser?.name ? `with ${tradedToUser.name}` : ""
            }`}
            subtitle={
              tradedToUser ? (
                <>
                  {tradesTotal === 0 ? (
                    `You and ${tradedToUser.name} are settled up!`
                  ) : (
                    <>
                      {`${tradesTotal > 0 ? tradedToUser.name : "You"} owe${
                        tradesTotal > 0 ? "s You" : ` ${tradedToUser.name}`
                      }: `}
                      <Text action={tradesTotal > 0 ? "success" : "danger"}>
                        {currency(Math.abs(tradesTotal) / 100)}
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
              <View className="flex flex-row gap-2 lg:ml-auto lg:mt-0 mt-2 min-w-fit">
                {tradedToUser && tradesTotal !== 0 && (
                  <Button
                    type="outlined"
                    text="Settle Up"
                    icon={faReceipt}
                    className="flex-1 lg:max-w-fit"
                    onClick={() => setSettleUpOpen(true)}
                  />
                )}

                <Button
                  type="outlined"
                  text="New Trade"
                  className="flex-1 lg:max-w-fit"
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
                  title: "Date",
                  row: (trade) => (
                    <Text>
                      {moment(trade.created).format(
                        `${width > 600 ? "MMM Do, YYYY" : "MMM Do"}`
                      )}
                    </Text>
                  ),
                },
                {
                  title: `${width > 600 ? "You " : ""}Traded`,
                  row: (trade) => (
                    <Text>{currency(trade.tradingUserTotal / 100)}</Text>
                  ),
                },
                {
                  title: `${width > 600 ? "You " : ""}Received`,
                  row: (trade) => (
                    <Text>{currency(trade.tradedToUserTotal / 100)}</Text>
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

      <Footer />
    </SafeAreaView>
  );
}
