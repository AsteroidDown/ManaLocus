import DeckCardGallery from "@/components/decks/deck-card-gallery";
import DeckChangeLog from "@/components/decks/deck-change-log";
import DeckExampleHand from "@/components/decks/deck-example-hand";
import DeckFooter from "@/components/decks/deck-footer";
import DeckHeader from "@/components/decks/deck-header";
import Graph from "@/components/graph/graph";
import Box from "@/components/ui/box/box";
import Button from "@/components/ui/button/button";
import Divider from "@/components/ui/divider/divider";
import { BoardTypes } from "@/constants/boards";
import DeckContext from "@/contexts/deck/deck.context";
import { graphCardsByCost } from "@/functions/card-graphing";
import { setLocalStorageCards } from "@/functions/local-storage/card-local-storage";
import { faChartSimple, faDatabase } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect } from "react";
import { ScrollView, View } from "react-native";

export default function DeckPage() {
  const { deck } = useContext(DeckContext);

  const [stacked, setStacked] = React.useState(true);

  useEffect(() => {
    if (!deck) return;

    setLocalStorageCards([], BoardTypes.MAIN);
    setLocalStorageCards([], BoardTypes.SIDE);
    setLocalStorageCards([], BoardTypes.MAYBE);
    setLocalStorageCards([], BoardTypes.ACQUIRE);
  }, [deck]);

  if (!deck) return;

  return (
    <ScrollView>
      <DeckHeader deck={deck} />

      <View className="flex flex-1 gap-8 px-16 py-8 min-h-[100vh] bg-background-100">
        <DeckCardGallery deck={deck} />

        <Divider thick className="!border-background-200" />

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

          <DeckChangeLog className="flex-1" deck={deck} />
        </View>

        <DeckExampleHand deck={deck} />
      </View>

      <DeckFooter deck={deck} />
    </ScrollView>
  );
}
