import DashboardSectionView from "@/components/dashboard/dashboard-section";
import DeckCardGallery from "@/components/decks/deck-card-gallery";
import DeckChangeLog from "@/components/decks/deck-change-log";
import DeckExampleHand from "@/components/decks/deck-example-hand";
import DeckFooter from "@/components/decks/deck-footer";
import DeckHeader from "@/components/decks/deck-header";
import Graph from "@/components/graph/graph";
import Box from "@/components/ui/box/box";
import Button from "@/components/ui/button/button";
import Divider from "@/components/ui/divider/divider";
import TabBar from "@/components/ui/tabs/tab-bar";
import { BoardTypes } from "@/constants/boards";
import DeckContext from "@/contexts/deck/deck.context";
import { graphCardsByCost } from "@/functions/card-graphing";
import { setLocalStorageCards } from "@/functions/local-storage/card-local-storage";
import { setLocalStorageDashboard } from "@/functions/local-storage/dashboard-local-storage";
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
    setLocalStorageDashboard({ sections: [] });
  }, [deck]);

  if (!deck) return;

  return (
    <ScrollView className="bg-background-100">
      <DeckHeader deck={deck} />

      <View className="flex flex-1 gap-8 px-16 py-8 border-t-2 border-background-200 bg-background-100">
        <TabBar
          tabs={[
            {
              title: "Deck",
              children: (
                <DeckCardGallery
                  className="py-8 border-t-2 border-background-200"
                  deck={deck}
                />
              ),
            },
            {
              title: "Dashboard",
              children: (
                <View className="flex-1 flex flex-row flex-wrap gap-6 justify-center items-center mb-8 border-t-2 border-background-200">
                  {deck.dashboard?.sections.map((section, index) => (
                    <DashboardSectionView
                      readonly
                      cards={deck.main}
                      sectionId={section.id}
                      loadedSection={section}
                      key={section.title + index}
                    />
                  ))}
                </View>
              ),
            },
          ]}
        />

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

        <Divider thick className="!border-background-200" />

        <DeckExampleHand deck={deck} />
      </View>

      <DeckFooter deck={deck} />
    </ScrollView>
  );
}
