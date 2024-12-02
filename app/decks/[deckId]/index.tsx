import DeckCardGallery from "@/components/decks/deck-card-gallery";
import DeckChangeLog from "@/components/decks/deck-change-log";
import Graph from "@/components/graph/graph";
import Box from "@/components/ui/box/box";
import Button from "@/components/ui/button/button";
import Text from "@/components/ui/text/text";
import { BoardTypes } from "@/constants/boards";
import { LostURL } from "@/constants/urls";
import DeckContext from "@/contexts/deck/deck.context";
import UserContext from "@/contexts/user/user.context";
import { graphCardsByCost } from "@/functions/card-graphing";
import { setLocalStorageCards } from "@/functions/local-storage/card-local-storage";
import { currency, titleCase } from "@/functions/text-manipulation";
import DeckService from "@/hooks/services/deck.service";
import { DeckChange } from "@/models/deck/deck-change";
import {
  faChartSimple,
  faDatabase,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Image, ScrollView, View } from "react-native";

export default function DeckPage() {
  const { user } = useContext(UserContext);
  const { deck } = useContext(DeckContext);

  const [stacked, setStacked] = React.useState(true);
  const [changes, setChanges] = React.useState(null as DeckChange | null);

  const [mainCards, setMainCards] = React.useState(0);
  const [sideCards, setSideCards] = React.useState(0);
  const [totalValue, setTotalValue] = React.useState(0);

  useEffect(() => {
    if (!deck) return;

    setLocalStorageCards([], BoardTypes.MAIN);
    setLocalStorageCards([], BoardTypes.SIDE);
    setLocalStorageCards([], BoardTypes.MAYBE);
    setLocalStorageCards([], BoardTypes.ACQUIRE);

    DeckService.getChanges(deck.id).then((changes) => setChanges(changes));
  }, [deck]);

  useEffect(() => {
    if (!deck) return;

    setMainCards(deck.main.reduce((acc, card) => acc + card.count, 0));
    setSideCards(deck.side.reduce((acc, card) => acc + card.count, 0));
    setTotalValue(
      deck.main.reduce((acc, card) => acc + (card.prices?.usd ?? 0), 0)
    );
  }, [deck]);

  if (!deck) return;

  return (
    <ScrollView>
      <View className="relative h-64">
        <Image
          source={{
            uri: deck.featuredArtUrl?.length ? deck.featuredArtUrl : LostURL,
          }}
          className="absolute h-[384px] w-[60%] top-0 right-0"
        />

        <View className="absolute w-full h-full bg-gradient-to-r from-primary-300 from-[41%] to-transparent to-75%" />

        <View className="absolute w-full h-full bg-gradient-to-b from-transparent to-black opacity-40" />

        <View className="absolute flex justify-center gap-1 w-full h-full px-11 top-0 left-0">
          <Text thickness="bold" className="!text-5xl">
            {deck.name}
          </Text>

          <View className="flex flex-row gap-2 items-center">
            <Text
              size="sm"
              thickness="bold"
              className={`px-2 py-1 bg-dark-200 bg-opacity-85 rounded-xl w-fit h-fit`}
            >
              {deck.format?.length ? titleCase(deck.format) : "TBD"}
            </Text>

            <Text size="lg" thickness="medium">
              By {deck.user?.name}
            </Text>
          </View>
        </View>

        <View className="absolute flex justify-center w-full h-full px-11 top-0 left-0">
          <Text size="sm" className="mt-auto">
            {currency(totalValue)}
          </Text>

          <Text size="sm" className="mb-4">
            {mainCards} Cards{sideCards ? ` + ${sideCards} Card Sideboard` : ""}
          </Text>
        </View>

        {user?.id === deck.userId && (
          <View className="absolute top-4 right-6 shadow-lg">
            <Link href={`${deck.id}/builder/main-board`}>
              <Button
                text="Edit"
                icon={faPen}
                action="primary"
                className="w-full"
              />
            </Link>
          </View>
        )}
      </View>

      <View className="flex flex-1 gap-8 px-11 py-8 min-h-[100vh] bg-background-100">
        <DeckCardGallery deck={deck} />

        <View className="flex flex-row gap-12">
          <Box className="flex-1" shade={100}>
            <Graph
              readonly
              title="Mana Curve"
              className="flex-1"
              stacked={stacked}
              sets={graphCardsByCost(deck.main)}
              titleStart={
                <Button
                  rounded
                  type="clear"
                  action="default"
                  icon={stacked ? faDatabase : faChartSimple}
                  onClick={() => setStacked(!stacked)}
                />
              }
            />
          </Box>

          {changes && <DeckChangeLog className="flex-1" changes={changes} />}
        </View>
      </View>
    </ScrollView>
  );
}
