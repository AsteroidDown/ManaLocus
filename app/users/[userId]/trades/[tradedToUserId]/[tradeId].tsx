import TradeCardDetails from "@/components/trades/trade-card-details";
import Divider from "@/components/ui/divider/divider";
import Text from "@/components/ui/text/text";
import BodyHeightContext from "@/contexts/ui/body-height.context";
import UserPageContext from "@/contexts/user/user-page.context";
import UserContext from "@/contexts/user/user.context";
import { currency } from "@/functions/text-manipulation";
import TradeService from "@/hooks/services/trade.service";
import UserService from "@/hooks/services/user.service";
import { Trade } from "@/models/trade/trade";
import { User } from "@/models/user/user";
import { useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView, View } from "react-native";

export default function TradePage() {
  const { user } = useContext(UserContext);
  const { userPageUser } = useContext(UserPageContext);
  if (!user || !userPageUser) return null;
  if (user?.id !== userPageUser?.id) return null;

  const buffer = 164;

  const { tradeId } = useLocalSearchParams();
  const { tradedToUserId } = useLocalSearchParams();

  const { setBodyHeight } = useContext(BodyHeightContext);

  const containerRef = useRef<View>(null);

  const [tradedToUser, setTradedToUser] = useState(null as User | null);

  const [loading, setLoading] = useState(false);

  const [trade, setTrade] = useState(null as Trade | null);

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
      if (trade.tradedToUser?.id === userPageUser.id) {
        const tradingUserTotal = trade.tradingUserTotal;
        trade.tradingUserTotal = trade.tradedToUserTotal;
        trade.tradedToUserTotal = tradingUserTotal;

        const tradingUserCards = trade.tradingUserCards;
        trade.tradingUserCards = trade.tradedToUserCards;
        trade.tradedToUserCards = tradingUserCards;

        trade.total *= -1;
      }

      setTrade(trade);
    });
  }, [tradeId, tradedToUserId]);

  if (!trade) return;

  return (
    <SafeAreaView className="flex-1 w-full h-full bg-background-100">
      <View
        ref={containerRef}
        className="flex my-4"
        onLayout={() =>
          containerRef.current?.measureInWindow((_x, _y, _width, height) =>
            setBodyHeight(height + buffer)
          )
        }
      >
        <View className="flex flex-row justify-between items-center gap-4 mb-4">
          <Text size="xl" thickness="semi">
            Trade with
            {tradedToUser?.name
              ? ` with ${tradedToUser.name} on `
              : " Anonymous on "}
            {moment(trade.created).format("MMM Do, YYYY")}
          </Text>
        </View>

        <View className="flex lg:flex-row gap-4 mb-6 min-h-fit">
          <View className="flex-1 flex gap-2">
            <Text size="lg" thickness="semi">
              Your Cards
            </Text>

            <View className="flex gap-2 min-h-fit mb-2">
              {trade.tradingUserCards?.map((card) => (
                <TradeCardDetails
                  readonly
                  key={card.scryfallId}
                  tradeCard={card}
                />
              ))}
            </View>

            <Divider thick className="!border-background-200 mt-auto" />

            <Text size="lg" thickness="semi">
              Your Total: {currency(trade.tradingUserTotal / 100)}
            </Text>
          </View>

          <View className="flex-1 flex gap-2 min-h-fit">
            <Text size="lg" thickness="semi">
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

            <Text size="lg" thickness="semi">
              {trade.tradedToUser
                ? (trade.tradedToUser as any)?.username + "'s"
                : "Their"}{" "}
              Total: {currency(trade.tradedToUserTotal / 100)}
            </Text>
          </View>
        </View>

        <Divider thick className="!border-background-200 mb-4" />

        <Text size="lg" thickness="semi">
          {trade.total > 0
            ? `${tradedToUser ? tradedToUser.name + " owes" : "They owe"} you`
            : trade.total === 0
            ? "This trade was even!"
            : `You owe ${tradedToUser ? tradedToUser.name : "them"}`}
          <Text
            size="lg"
            thickness="semi"
            action={trade.total > 0 ? "success" : "danger"}
          >
            {trade.total !== 0 && " " + currency(Math.abs(trade.total / 100))}
          </Text>
          {trade.total !== 0 && " for this trade"}
        </Text>
      </View>
    </SafeAreaView>
  );
}
