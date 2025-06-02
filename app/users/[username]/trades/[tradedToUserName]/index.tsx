import SettleUpModal from "@/components/trades/settle-up-modal";
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

  const { tradedToUserName } = useLocalSearchParams();

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
      !tradedToUserName ||
      tradedToUserName === "anonymous" ||
      typeof tradedToUserName !== "string"
    ) {
      return;
    }

    setLoading(true);

    UserService.get({ username: tradedToUserName }).then((user) =>
      setTradedToUser(user)
    );
  }, [tradedToUserName]);

  useEffect(() => {
    if (!tradedToUserName || typeof tradedToUserName !== "string") return;

    TradeService.getTotalBetweenUsers(
      userPageUser.id,
      tradedToUserName === "anonymous" ? "0" : tradedToUserName
    ).then((response) => setTradesTotal(response?.total ?? 0));
  }, [tradedToUserName]);

  useEffect(() => {
    if (!tradedToUser && tradedToUserName !== "anonymous") return;

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
            title={`Trades ${
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
                "Your trades made without another user"
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
                onClick={() => router.push(`users/${userPageUser.name}/trades`)}
              />
            }
            end={
              user &&
              user.verified &&
              user.id === userPageUser.id && (
                <View className="flex flex-row gap-2 lg:mt-0 mt-4 lg:w-fit w-full">
                  <Button
                    size="sm"
                    type="outlined"
                    text="Settle Up"
                    icon={faReceipt}
                    className="flex-1 lg:max-w-fit"
                    disabled={!tradedToUser || tradesTotal === 0}
                    onClick={() => setSettleUpOpen(true)}
                  />

                  <Tooltip
                    containerClasses="flex-1 lg:max-w-fit"
                    text={
                      (user?.access?.tradesThisMonth || 0) > 0
                        ? `Trades this month (${user?.tradesThisMonth}/${user?.access?.tradesThisMonth})`
                        : ""
                    }
                  >
                    <Button
                      size="sm"
                      type="outlined"
                      text="New Trade"
                      icon={faPlus}
                      disabled={
                        (user?.access?.tradesThisMonth || 0) > 0 &&
                        (user?.tradesThisMonth || 0) >=
                          (user?.access?.tradesThisMonth || 0)
                      }
                      onClick={() =>
                        router.push(
                          `users/${userPageUser.name}/trades/new-trade${
                            tradedToUser
                              ? `?tradedToUserName=${tradedToUser.name}`
                              : ""
                          }`
                        )
                      }
                    />
                  </Tooltip>
                </View>
              )
            }
          />
        )}

        <Table
          className="mb-2"
          data={trades}
          loading={loading}
          rowClick={(trade: Trade) =>
            router.push(
              `users/${userPageUser.name}/trades/${
                tradedToUser?.name ?? "anonymous"
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
