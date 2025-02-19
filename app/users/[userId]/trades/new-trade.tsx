import TradeCardDetails from "@/components/trades/trade-card-details";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Divider from "@/components/ui/divider/divider";
import Select from "@/components/ui/input/select";
import Text from "@/components/ui/text/text";
import BodyHeightContext from "@/contexts/ui/body-height.context";
import UserContext from "@/contexts/user/user.context";
import { currency } from "@/functions/text-manipulation";
import ScryfallService from "@/hooks/services/scryfall.service";
import TradeService from "@/hooks/services/trade.service";
import UserService from "@/hooks/services/user.service";
import { TradeCard } from "@/models/trade/trade";
import { User } from "@/models/user/user";
import { router } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView, View } from "react-native";

export default function NewTradePage() {
  const { user } = useContext(UserContext);
  const { setBodyHeight } = useContext(BodyHeightContext);

  const buffer = 164;

  const containerRef = useRef<View>(null);

  const [tradedToUser, setTradedToUser] = useState(null as User | null);
  const [tradedToUserSearch, setTradedToUserSearch] = useState("");
  const [tradedToUserOptions, setTradedToUserOptions] = useState([] as User[]);

  const [tradingUserCards, setTradingUserCards] = useState([] as TradeCard[]);
  const [tradedToUserCards, setTradedToUserCards] = useState([] as TradeCard[]);

  const [tradingUserTotal, setTradingUserTotal] = useState(0);
  const [tradedToUserTotal, setTradedToUserTotal] = useState(0);

  const [total, setTotal] = useState(0);

  const [tradingCardSearch, setTradingCardSearch] = useState("");
  const [tradingCardAutoComplete, setTradingCardAutoComplete] = useState(
    [] as string[]
  );
  const [tradingCard, setTradingCard] = useState("");

  const [tradedCardSearch, setTradedCardSearch] = useState("");
  const [tradedCardAutoComplete, setTradedCardAutoComplete] = useState(
    [] as string[]
  );
  const [tradedCard, setTradedCard] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!tradedToUser) return;

    setTradedToUserCards(
      tradedToUserCards.map((card) => ({ ...card, userId: tradedToUser.id }))
    );
  }, [tradedToUser]);

  useEffect(() => {
    if (tradedToUserSearch.length < 3) return;

    UserService.getMany({ search: tradedToUserSearch }).then((response) => {
      setTradedToUserOptions(response.data);
    });
  }, [tradedToUserSearch]);

  useEffect(() => {
    setTradingUserTotal(
      tradingUserCards.reduce(
        (acc, card) => acc + (card.price || 0) * card.count,
        0
      )
    );
  }, [tradingUserCards]);

  useEffect(() => {
    setTradedToUserTotal(
      tradedToUserCards.reduce(
        (acc, card) => acc + (card.price || 0) * card.count,
        0
      )
    );
  }, [tradedToUserCards]);

  useEffect(() => {
    setTotal(tradingUserTotal - tradedToUserTotal);
  }, [tradingUserTotal, tradedToUserTotal]);

  useEffect(() => {
    if (!tradingCardSearch) {
      setTradedCardSearch("");
      setTradedCardAutoComplete([]);
      return;
    }

    ScryfallService.autocomplete(tradingCardSearch).then((names) => {
      if (!names.includes(tradingCardSearch)) setTradingCardAutoComplete(names);
      else setTradingCardAutoComplete([]);
    });
  }, [tradingCardSearch]);

  useEffect(() => {
    if (
      !tradingCard ||
      tradingUserCards.map((card) => card.card.name).includes(tradingCard)
    ) {
      return;
    }

    ScryfallService.getCard(tradingCard, true).then((card) => {
      setTradingUserCards(
        tradingUserCards.concat({
          id: "",
          count: 1,
          card: card,
          tradeId: "",
          foil: false,
          userId: user?.id,
          scryfallId: card.scryfallId,
          price: (card.prices?.usd || 0) * 100,
        })
      );
      setTradingCard("");
    });
  }, [tradingCard]);

  useEffect(() => {
    if (!tradedCardSearch) {
      setTradedCardSearch("");
      setTradedCardAutoComplete([]);
      return;
    }

    ScryfallService.autocomplete(tradedCardSearch).then((names) => {
      if (!names.includes(tradedCardSearch)) setTradedCardAutoComplete(names);
      else setTradedCardAutoComplete([]);
    });
  }, [tradedCardSearch]);

  useEffect(() => {
    if (
      !tradedCard ||
      tradedToUserCards.map((card) => card.card.name).includes(tradedCard)
    ) {
      return;
    }

    ScryfallService.getCard(tradedCard, true).then((card) => {
      setTradedToUserCards(
        tradedToUserCards.concat({
          id: "",
          count: 1,
          card: card,
          tradeId: "",
          foil: false,
          userId: tradedToUser?.id,
          scryfallId: card.scryfallId,
          price: (card.prices?.usd || 0) * 100,
        })
      );
      setTradedCard("");
    });
  }, [tradedCard]);

  function create() {
    if (!user) return;

    setLoading(true);

    TradeService.create(user.id, {
      tradingUserId: user.id,
      tradedToUserId: tradedToUser?.id,
      tradingUserCards,
      tradedToUserCards,
      tradingUserTotal,
      tradedToUserTotal,
      total,
    }).then((response) => {
      setLoading(false);

      if ((response as any).message === "Trade created!") {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          if (tradedToUser) {
            router.push(`users/${user.id}/trades/${tradedToUser.id}`);
          } else {
            router.push(`users/${user.id}/trades`);
          }
        }, 2000);
      } else {
        setError(true);
        setTimeout(() => setError(false), 2000);
      }
    });
  }

  return (
    <SafeAreaView className="flex-1 w-full h-full bg-background-100">
      <View
        ref={containerRef}
        className="flex gap-4 my-4"
        onLayout={() =>
          containerRef.current?.measureInWindow((_x, _y, _width, height) =>
            setBodyHeight(height + buffer)
          )
        }
      >
        <BoxHeader
          className="!pb-0"
          title={`New Trade ${tradedToUser ? `with ${tradedToUser.name}` : ""}`}
        />

        <View className="z-[16]">
          <Select
            value={tradedToUser}
            onChange={setTradedToUser}
            onSearchChange={setTradedToUserSearch}
            placeholder="Find a user to trade with"
            options={tradedToUserOptions.map((user) => ({
              label: user.name,
              value: user,
            }))}
          />
        </View>

        <View className="flex lg:flex-row gap-4 z-[14]">
          <View className="flex-1 flex gap-2 min-h-fit z-[12]">
            <View className="flex gap-2 min-w-[250px] z-[12] ">
              <Text size="lg" thickness="semi">
                Your Cards
              </Text>

              <Select
                clearOnFocus
                placeholder="Find a card"
                value={tradingCard}
                onChange={setTradingCard}
                onSearchChange={setTradingCardSearch}
                options={tradingCardAutoComplete.map((card) => ({
                  label: card,
                  value: card,
                }))}
              />
            </View>

            <View className="flex gap-2 flex-1 mt-2 min-h-fit">
              <View className="flex gap-2 z-[10]">
                {tradingUserCards?.map((card, index) => (
                  <TradeCardDetails
                    key={card.scryfallId}
                    tradeCard={card}
                    zIndex={tradingUserCards.length - index}
                    onChange={(updatedCard) => {
                      tradingUserCards[index] = updatedCard;
                      setTradingUserCards([...tradingUserCards]);
                    }}
                    onDelete={(tradeCard) => {
                      tradingUserCards.splice(
                        tradingUserCards.indexOf(tradeCard),
                        1
                      );
                      setTradingUserCards([...tradingUserCards]);
                    }}
                  />
                ))}
              </View>

              <Divider thick className="!border-background-200 mt-auto" />

              <Text size="lg" thickness="semi">
                Your Total: {currency(tradingUserTotal / 100)}
              </Text>
            </View>
          </View>

          <View className="flex-1 flex gap-2 min-h-fit z-[10]">
            <View className="flex gap-2 min-w-[250px] z-[10] ">
              <Text size="lg" thickness="semi">
                {tradedToUser ? tradedToUser.name + "'s" : "Their"} Cards
              </Text>

              <Select
                clearOnFocus
                placeholder="Find a card"
                value={tradedCard}
                onChange={setTradedCard}
                onSearchChange={setTradedCardSearch}
                options={tradedCardAutoComplete.map((card) => ({
                  label: card,
                  value: card,
                }))}
              />
            </View>

            <View className="flex gap-2 flex-1 mt-2 min-h-fit">
              <View className="flex gap-2 z-[10]">
                {tradedToUserCards?.map((card, index) => (
                  <TradeCardDetails
                    key={card.scryfallId}
                    tradeCard={card}
                    zIndex={tradedToUserCards.length - index}
                    onChange={(updatedCard) => {
                      tradedToUserCards[index] = updatedCard;
                      setTradedToUserCards([...tradedToUserCards]);
                    }}
                    onDelete={(tradeCard) => {
                      tradedToUserCards.splice(
                        tradedToUserCards.indexOf(tradeCard),
                        1
                      );
                      setTradedToUserCards([...tradedToUserCards]);
                    }}
                  />
                ))}
              </View>

              <Divider thick className="!border-background-200 mt-auto" />

              <Text size="lg" thickness="semi">
                {tradedToUser ? tradedToUser.name + "'s" : "Their"} Total:{" "}
                {currency(tradedToUserTotal / 100)}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex flex-row gap-4 justify-end mt-4">
          <View className="lg:min-w-fit min-w-full flex gap-2">
            <Text size="md" thickness="medium">
              {tradingUserCards?.length > 0 || tradedToUserCards?.length > 0
                ? total > 0
                  ? `${
                      tradedToUser ? tradedToUser.name + " will" : "They'll"
                    } owe you:`
                  : total === 0
                  ? "The trade is even!"
                  : `You'll owe ${tradedToUser ? tradedToUser.name : "them"}: `
                : ""}

              <Text
                size="md"
                thickness="semi"
                action={total > 0 ? "success" : "danger"}
              >
                {total !== 0 && " " + currency(Math.abs(total / 100))}
              </Text>
            </Text>

            <Button
              className="lg:max-w-fit lg:self-end"
              action={error ? "danger" : success ? "success" : "primary"}
              text={
                loading
                  ? "Saving..."
                  : error
                  ? "Error"
                  : success
                  ? "Trade Saved!"
                  : "Save Trade"
              }
              disabled={
                loading ||
                (!tradingUserCards?.length && !tradedToUserCards?.length)
              }
              onClick={create}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
