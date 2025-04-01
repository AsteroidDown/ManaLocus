import TradeCardDetails from "@/components/trades/trade-card-details";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Divider from "@/components/ui/divider/divider";
import Footer from "@/components/ui/navigation/footer";
import Text from "@/components/ui/text/text";
import UserPageContext from "@/contexts/user/user-page.context";
import UserContext from "@/contexts/user/user.context";
import { currency } from "@/functions/text-manipulation";
import TradeService from "@/hooks/services/trade.service";
import UserService from "@/hooks/services/user.service";
import { Trade } from "@/models/trade/trade";
import { User } from "@/models/user/user";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";

export default function TradePage() {
  const { userId, tradeId, tradedToUserId } = useLocalSearchParams();

  const { user } = useContext(UserContext);
  const { userPageUser } = useContext(UserPageContext);

  const [tradedToUser, setTradedToUser] = useState(null as User | null);

  const [loading, setLoading] = useState(false);

  const [trade, setTrade] = useState(null as Trade | null);

  useEffect(() => {
    if (!user || !userPageUser || user?.id !== userPageUser?.id) {
      router.push(
        `login?redirect=${process.env.BASE_URL}/users/${userId}/trades/${tradedToUserId}/${tradeId}`
      );
    }
  }, [user, userPageUser]);

  useEffect(() => {
    if (
      !userPageUser ||
      typeof tradeId !== "string" ||
      typeof tradedToUserId !== "string"
    ) {
      return;
    }

    setLoading(true);

    if (tradedToUserId !== "anonymous") {
      UserService.get(tradedToUserId).then((user) => setTradedToUser(user));
    }

    TradeService.get(
      userPageUser.id,
      tradedToUserId === "anonymous" ? "0" : tradedToUserId,
      tradeId
    ).then((trade) => {
      if (trade?.tradedToUser?.id === userPageUser.id) {
        const tradingUserTotal = trade.tradingUserTotal;
        trade.tradingUserTotal = trade.tradedToUserTotal;
        trade.tradedToUserTotal = tradingUserTotal;

        const tradingUserCards = trade.tradingUserCards;
        trade.tradingUserCards = trade.tradedToUserCards;
        trade.tradedToUserCards = tradingUserCards;

        trade.total *= -1;
      }

      if (!trade.tradingUserCards?.length) {
        trade.tradingUserCards = [
          {
            count: 1,
            name: "No Cards Traded",
            foil: false,
            id: "",
            tradeId: "",
          },
        ];
      }

      if (!trade.tradedToUserCards?.length) {
        trade.tradedToUserCards = [
          {
            count: 1,
            name: "No Cards Traded",
            foil: false,
            id: "",
            tradeId: "",
          },
        ];
      }

      setTrade(trade);
    });
  }, [tradeId, tradedToUserId]);

  if (!trade) return;

  return (
    <SafeAreaView className="flex-1 w-full h-full bg-background-100">
      <View className="flex my-4 lg:px-16 px-4 min-h-[100dvh]">
        <View className="flex flex-row justify-between items-center gap-4">
          <BoxHeader
            title={`Trade with${
              tradedToUser?.name ? ` ${tradedToUser.name}` : " Anonymous"
            }`}
            subtitle={moment(trade.created).format("MMM Do, YYYY")}
            start={
              <Button
                rounded
                size="lg"
                type="clear"
                action="default"
                className="-mx-2"
                icon={faArrowLeft}
                onClick={() =>
                  router.push(
                    `users/${userPageUser.id}/trades${
                      tradedToUserId ? `/${tradedToUserId}` : "anonymous"
                    }`
                  )
                }
              />
            }
          />
        </View>

        <View className="flex lg:flex-row gap-4 mb-6 min-h-fit">
          <View className="flex-1 flex gap-2">
            <Text size="lg" weight="semi">
              Your Cards
            </Text>

            <View className="flex gap-2 min-h-fit mb-2">
              {trade.tradingUserCards?.map((card, index) => (
                <TradeCardDetails
                  readonly
                  key={`${card.scryfallId}-${index}`}
                  tradeCard={card}
                />
              ))}
            </View>

            <Divider thick className="!border-background-200 mt-auto" />

            <Text size="lg" weight="semi">
              Your Total: {currency(trade.tradingUserTotal / 100)}
            </Text>
          </View>

          <View className="flex-1 flex gap-2 min-h-fit">
            <Text size="lg" weight="semi">
              {trade.tradedToUser
                ? (trade.tradedToUser as any)?.username + "'s"
                : "Their"}{" "}
              Cards
            </Text>

            <View className="flex gap-2 min-h-fit mb-2">
              {trade.tradedToUserCards?.map((card) => (
                <TradeCardDetails
                  readonly
                  key={card.scryfallId}
                  tradeCard={card}
                />
              ))}
            </View>

            <Divider thick className="!border-background-200 mt-auto" />

            <Text size="lg" weight="semi">
              {trade.tradedToUser
                ? (trade.tradedToUser as any)?.username + "'s"
                : "Their"}{" "}
              Total: {currency(trade.tradedToUserTotal / 100)}
            </Text>
          </View>
        </View>

        <Divider thick className="!border-background-200 mb-4" />

        <Text size="lg" weight="semi">
          {trade.total > 0
            ? `${tradedToUser ? tradedToUser.name + " owes" : "They owe"} you`
            : trade.total === 0
            ? "This trade was even!"
            : `You owe ${tradedToUser ? tradedToUser.name : "them"}`}
          <Text
            size="lg"
            weight="semi"
            action={trade.total > 0 ? "success" : "danger"}
          >
            {trade.total !== 0 && " " + currency(Math.abs(trade.total / 100))}
          </Text>
          {trade.total !== 0 && " for this trade"}
        </Text>
      </View>

      <Footer />
    </SafeAreaView>
  );
}
