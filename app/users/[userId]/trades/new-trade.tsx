import TradeCardDetails from "@/components/trades/trade-card-details";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Checkbox from "@/components/ui/checkbox/checkbox";
import Divider from "@/components/ui/divider/divider";
import Select from "@/components/ui/input/select";
import Text from "@/components/ui/text/text";
import BodyHeightContext from "@/contexts/ui/body-height.context";
import ToastContext from "@/contexts/ui/toast.context";
import UserContext from "@/contexts/user/user.context";
import { currency } from "@/functions/text-manipulation";
import DeckService from "@/hooks/services/deck.service";
import ScryfallService from "@/hooks/services/scryfall.service";
import TradeService from "@/hooks/services/trade.service";
import UserService from "@/hooks/services/user.service";
import { Deck } from "@/models/deck/deck";
import { TradeCardDTO, TradeDTO } from "@/models/trade/dtos/trade.dto";
import { User } from "@/models/user/user";
import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView, useWindowDimensions, View } from "react-native";

export default function NewTradePage() {
  const { user } = useContext(UserContext);
  const { setBodyHeight } = useContext(BodyHeightContext);
  const { addToast } = useContext(ToastContext);

  const buffer = 164;

  const width = useWindowDimensions().width;

  const containerRef = useRef<View>(null);

  const { tradedToUserId } = useLocalSearchParams();

  const [tradedToUser, setTradedToUser] = useState(null as User | null);
  const [tradedToUserSearch, setTradedToUserSearch] = useState("");
  const [tradedToUserOptions, setTradedToUserOptions] = useState([] as User[]);

  const [tradingUserCards, setTradingUserCards] = useState(
    [] as TradeCardDTO[]
  );
  const [tradedToUserCards, setTradedToUserCards] = useState(
    [] as TradeCardDTO[]
  );

  const [tradingUserTotal, setTradingUserTotal] = useState(0);
  const [tradedToUserTotal, setTradedToUserTotal] = useState(0);

  const [total, setTotal] = useState(0);
  const [evenTrade, setEvenTrade] = useState(false);

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

  const [useTradingUserCollection, setUseTradingUserCollection] =
    useState(false);
  const [tradingUserCollections, setTradingUserCollections] = useState(
    [] as Deck[]
  );
  const [tradingUserCollection, setTradingUserCollection] = useState(
    null as Deck | null
  );

  const [useTradedToUserCollection, setUseTradedToUserCollection] =
    useState(false);
  const [tradedToUserCollections, setTradedToUserCollections] = useState(
    [] as Deck[]
  );
  const [tradedToUserCollection, setTradedToUserCollection] = useState(
    null as Deck | null
  );

  const [previousTradesTotal, setPreviousTradesTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (tradedToUser || !tradedToUserId || typeof tradedToUserId !== "string") {
      return;
    }

    UserService.get(tradedToUserId).then((user) => {
      setTradedToUser(user);
      setTradedToUserOptions([user]);
    });
  }, [tradedToUserId]);

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
      tradingUserCards.map((card) => card.card?.name).includes(tradingCard)
    ) {
      return;
    }

    const tradeCardIndex = tradingUserCards.length;
    const tradingNewCards = tradingUserCards.concat({
      count: 1,
      card: undefined,
      foil: false,
      userId: tradedToUser?.id,
      scryfallId: undefined,
      price: undefined,
    });

    // setTradingUserCards(tradingNewCards);

    ScryfallService.getCard(tradingCard, true).then((card) => {
      tradingNewCards[tradeCardIndex] = {
        ...tradingNewCards[tradeCardIndex],
        card: card,
        name: card.name,
        scryfallId: card.scryfallId,
        price: (card.prices?.usd || 0) * 100,
      };

      setTimeout(() => setTradingUserCards([...tradingNewCards]), 50);
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
      tradedToUserCards.map((card) => card.card?.name).includes(tradedCard)
    ) {
      return;
    }

    const tradeCardIndex = tradedToUserCards.length;
    const tradedToNewCards = tradedToUserCards.concat({
      count: 1,
      card: undefined,
      foil: false,
      userId: tradedToUser?.id,
      scryfallId: undefined,
      price: undefined,
    });

    // setTradedToUserCards(tradedToNewCards);

    ScryfallService.getCard(tradedCard, true).then((card) => {
      tradedToNewCards[tradeCardIndex] = {
        ...tradedToNewCards[tradeCardIndex],
        card: card,
        name: card.name,
        scryfallId: card.scryfallId,
        price: (card.prices?.usd || 0) * 100,
      };

      setTradedToUserCards([...tradedToNewCards]);
      setTradedCard("");
    });
  }, [tradedCard]);

  useEffect(() => {
    DeckService.getMany({ userDecks: true, onlyCollections: true }).then(
      (response) => {
        setTradingUserCollections(response.data);
        if (response.data.length === 1) {
          setTradingUserCollection(response.data[0]);
        }
      }
    );
  }, [user]);

  useEffect(() => {
    if (!tradedToUser) return;

    DeckService.getMany({
      userId: tradedToUser.id,
      userDecks: true,
      onlyCollections: true,
    }).then((response) => {
      setTradedToUserCollections(response.data);
      if (response.data.length === 1) {
        setTradedToUserCollection(response.data[0]);
      }
    });
  }, [tradedToUser]);

  useEffect(() => {
    if (!user || !tradedToUser) return;

    TradeService.getTotalBetweenUsers(user.id, tradedToUser.id).then(
      (response) => {
        if (response?.total !== undefined)
          setPreviousTradesTotal(response.total);
      }
    );
  }, [tradedToUser]);

  function addTradingUserItem() {
    if (!user) return;

    setTradingUserCards([
      ...tradingUserCards,
      {
        name: "",
        count: 1,
        card: undefined,
        foil: false,
        userId: user.id,
        scryfallId: undefined,
        price: 0,
      },
    ]);
  }

  function addTradedToUserItem() {
    setTradedToUserCards([
      ...tradedToUserCards,
      {
        name: "",
        count: 1,
        card: undefined,
        foil: false,
        userId: tradedToUser?.id,
        scryfallId: undefined,
        price: 0,
      },
    ]);
  }

  function create() {
    if (!user) return;

    setLoading(true);

    const tradeUserTotal = evenTrade
      ? Math.max(tradingUserTotal, tradedToUserTotal)
      : 0;

    const dto: TradeDTO = {
      tradingUserId: user.id,
      tradedToUserId: tradedToUser?.id,
      total: evenTrade ? 0 : total,
      tradingUserTotal: evenTrade ? tradeUserTotal : tradingUserTotal,
      tradedToUserTotal: evenTrade ? tradeUserTotal : tradedToUserTotal,
      tradingUserCollectionId: useTradingUserCollection
        ? tradingUserCollection?.id
        : "",
      tradedToUserCollectionId: useTradedToUserCollection
        ? tradedToUserCollection?.id
        : "",
      tradingUserCards: tradingUserCards.map((tradeCard) => ({
        ...tradeCard,
        card: undefined,
      })),
      tradedToUserCards: tradedToUserCards.map((tradeCard) => ({
        ...tradeCard,
        card: undefined,
      })),
    };

    TradeService.create(user.id, dto).then((response) => {
      setLoading(false);

      if ((response as any).message === "Trade created!") {
        addToast({
          action: "success",
          title: "Trade Created!",
          subtitle: "You can now view the details of your trade.",
        });

        if (tradedToUser) {
          router.push(`users/${user.id}/trades/${tradedToUser.id}`);
        } else {
          router.push(`users/${user.id}/trades`);
        }
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
          title={`${width > 600 ? "New " : !tradedToUser ? "New " : ""}Trade ${
            tradedToUser ? `with ${tradedToUser.name}` : ""
          }`}
          start={
            <Button
              rounded
              size="lg"
              type="clear"
              action="default"
              className="-mx-2"
              icon={faArrowLeft}
              onClick={() =>
                tradedToUserId
                  ? router.push(`users/${user!.id}/trades/${tradedToUserId}`)
                  : router.push(`users/${user!.id}/trades`)
              }
            />
          }
        />

        <View className="z-[32]">
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

        <Divider thick className="!border-background-200 lg:my-0 my-4" />

        <View className="flex lg:flex-row gap-6 z-[30]">
          <View className="flex-1 flex justify-between gap-2 min-h-fit z-[28]">
            <View className="flex gap-2 min-w-[250px] z-[26]">
              <View className="flex flex-row flex-wrap gap-2 justify-between items-center">
                <Text size="lg" thickness="semi">
                  Your Cards
                </Text>

                <Button
                  size="sm"
                  type="clear"
                  icon={faPlus}
                  className="-my-2"
                  text="Add Non-Card"
                  buttonClasses="!px-2"
                  onClick={addTradingUserItem}
                />
              </View>

              <View className="z-[24]">
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

              <View className="flex gap-2 min-h-fit z-[22] transition-all duration-300">
                {tradingUserCards?.map((card, index) => (
                  <TradeCardDetails
                    key={`${card.scryfallId}-${index}`}
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
            </View>

            <View className="flex gap-2">
              <Divider thick className="!border-background-200" />

              <View className="flex flex-row flex-wrap gap-2 justify-between items-center">
                <Text size="lg" thickness="semi">
                  Your Total: {currency(tradingUserTotal / 100)}
                </Text>

                <Checkbox
                  label="Use Collection"
                  className="max-w-fit"
                  disabled={!tradingUserCollections?.length}
                  checked={useTradingUserCollection}
                  onChange={setUseTradingUserCollection}
                />
              </View>

              <View
                className={`${
                  useTradingUserCollection
                    ? "max-h-[500px]"
                    : "max-h-0 overflow-hidden -mb-4"
                } z-[20] transition-all duration-300`}
              >
                {useTradingUserCollection && (
                  <Select
                    value={tradingUserCollection}
                    onChange={setTradingUserCollection}
                    options={tradingUserCollections.map((collection) => ({
                      label: collection.name,
                      value: collection,
                    }))}
                  />
                )}
              </View>
            </View>
          </View>

          {width < 600 && (
            <Divider thick className="!border-background-200 mt-8 mb-6" />
          )}

          <View className="flex-1 flex justify-between gap-2 min-h-fit z-[18]">
            <View className="flex gap-2 min-w-[250px] z-[16]">
              <View className="flex flex-row flex-wrap gap-2 justify-between items-center">
                <Text size="lg" thickness="semi">
                  {tradedToUser ? tradedToUser.name + "'s" : "Their"} Cards
                </Text>

                <Button
                  size="sm"
                  type="clear"
                  icon={faPlus}
                  className="-my-2"
                  text="Add Non-Card"
                  buttonClasses="!px-2"
                  onClick={addTradedToUserItem}
                />
              </View>

              <View className="z-[14]">
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

              <View className="flex gap-2 min-h-fit z-[12] transition-all duration-300">
                {tradedToUserCards?.map((card, index) => (
                  <TradeCardDetails
                    key={`${card.scryfallId}-${index}`}
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
            </View>

            <View className="flex gap-2">
              <Divider thick className="!border-background-200" />

              <View className="flex flex-row flex-wrap gap-2 justify-between items-center">
                <Text size="lg" thickness="semi">
                  {tradedToUser ? tradedToUser.name + "'s" : "Their"} Total:{" "}
                  {currency(tradedToUserTotal / 100)}
                </Text>

                <Checkbox
                  label="Use Collection"
                  className="max-w-fit"
                  disabled={!tradedToUser || !tradedToUserCollections?.length}
                  checked={useTradedToUserCollection}
                  onChange={setUseTradedToUserCollection}
                />
              </View>

              <View
                className={`${
                  useTradingUserCollection || useTradedToUserCollection
                    ? "max-h-[500px]"
                    : "max-h-0 overflow-hidden -mb-4"
                } z-[10] transition-all duration-300`}
              >
                {(useTradingUserCollection || useTradedToUserCollection) && (
                  <Select
                    value={tradedToUserCollection}
                    onChange={setTradedToUserCollection}
                    disabled={!tradedToUser || !tradedToUserCollections?.length}
                    options={tradedToUserCollections.map((collection) => ({
                      label: collection.name,
                      value: collection,
                    }))}
                  />
                )}
              </View>
            </View>
          </View>
        </View>

        <Divider
          thick
          className="!border-background-200 lg:mt-0 mt-8 lg:mb-0 mb-4"
        />

        <View className="flex flex-row gap-4 justify-end mt-4">
          <View className="lg:flex-[0] flex-1 flex gap-4 lg:min-w-fit min-w-full">
            <Text size="md" thickness="medium" className="ml-auto">
              {tradingUserCards?.length > 0 || tradedToUserCards?.length > 0
                ? evenTrade
                  ? "The trade is even!"
                  : total > 0
                  ? `${previousTradesTotal ? "For this trade, " : ""}${
                      tradedToUser ? tradedToUser.name + " will" : "They'll"
                    } owe you:`
                  : total === 0
                  ? "The trade is even!"
                  : `${
                      previousTradesTotal ? "For this trade, " : ""
                    }You'll owe ${tradedToUser ? tradedToUser.name : "them"}: `
                : ""}

              {!evenTrade && total !== 0 && (
                <Text
                  size="md"
                  thickness="semi"
                  action={total > 0 ? "success" : "danger"}
                >
                  {total !== 0 && " " + currency(Math.abs(total / 100))}
                </Text>
              )}
            </Text>

            {(tradingUserCards?.length > 0 ||
              tradedToUserCards?.length > 0) && (
              <Divider thick className="!border-background-200" />
            )}

            <View className="flex flex-row justify-end items-center gap-4">
              {total !== 0 && (
                <Checkbox
                  label="Even Trade"
                  checked={evenTrade}
                  onChange={setEvenTrade}
                />
              )}

              <Button
                className="lg:max-w-fit lg:self-end"
                action={error ? "danger" : "primary"}
                text={loading ? "Saving..." : error ? "Error" : "Save Trade"}
                disabled={
                  loading ||
                  (!tradingUserCards?.length && !tradedToUserCards?.length)
                }
                onClick={create}
              />
            </View>

            {previousTradesTotal !== 0 && (
              <Text className="ml-auto max-w-fit">
                {tradingUserCards?.length > 0 || tradedToUserCards?.length > 0
                  ? `After this trade, ${
                      previousTradesTotal + (evenTrade ? 0 : total) === 0
                        ? `you and ${tradedToUser?.name} will be settled up!`
                        : `${
                            previousTradesTotal + (evenTrade ? 0 : total) > 0
                              ? tradedToUser?.name
                              : "you"
                          } will owe ${
                            previousTradesTotal + (evenTrade ? 0 : total) > 0
                              ? "you"
                              : tradedToUser?.name
                          }: `
                    }`
                  : previousTradesTotal + (evenTrade ? 0 : total) > 0
                  ? `${tradedToUser?.name} owes you: `
                  : `You owe ${tradedToUser?.name}: `}
                {previousTradesTotal + (evenTrade ? 0 : total) !== 0 && (
                  <Text
                    thickness="medium"
                    action={
                      previousTradesTotal + (evenTrade ? 0 : total) > 0
                        ? "success"
                        : "danger"
                    }
                  >
                    {currency(
                      Math.abs(previousTradesTotal + (evenTrade ? 0 : total)) /
                        100 || 0
                    )}
                  </Text>
                )}
              </Text>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
