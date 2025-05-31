import DeckCombos from "@/components/combos/deck-combos";
import DashboardSectionView from "@/components/dashboard/dashboard-section";
import DeckCardGallery from "@/components/decks/deck-card-gallery";
import DeckChangeLog from "@/components/decks/deck-change-log";
import DeckDescription from "@/components/decks/deck-description";
import DeckExampleHand from "@/components/decks/deck-example-hand";
import DeckFooter from "@/components/decks/deck-footer";
import DeckHeader from "@/components/decks/deck-header";
import DeckKits from "@/components/decks/deck-kits";
import DeckTokens from "@/components/decks/deck-tokens";
import Graph from "@/components/graph/graph";
import Box from "@/components/ui/box/box";
import Button from "@/components/ui/button/button";
import Divider from "@/components/ui/divider/divider";
import Footer from "@/components/ui/navigation/footer";
import TabBar from "@/components/ui/tabs/tab-bar";
import { BoardTypes } from "@/constants/boards";
import { BaseBracketDetails } from "@/constants/mtg/brackets";
import { MTGFormats } from "@/constants/mtg/mtg-format";
import { LegalityEvaluation } from "@/constants/mtg/mtg-legality";
import DeckContext from "@/contexts/deck/deck.context";
import UserContext from "@/contexts/user/user.context";
import { graphCardsByCost } from "@/functions/cards/card-graphing";
import { getBracketDetails } from "@/functions/decks/deck-bracket";
import { evaluateDeckLegality } from "@/functions/decks/deck-legality";
import { setLocalStorageCards } from "@/functions/local-storage/card-local-storage";
import { setLocalStorageDashboard } from "@/functions/local-storage/dashboard-local-storage";
import { faChartSimple, faDatabase } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";

export default function DeckPage() {
  const { user } = useContext(UserContext);
  const { deck } = useContext(DeckContext);

  const [stacked, setStacked] = useState(true);

  const [bracket, setBracket] = useState(BaseBracketDetails);
  const [legalityEvaluation, setLegalityEvaluation] = useState(
    {} as LegalityEvaluation
  );

  useEffect(() => {
    if (!deck) return;

    if (deck.private && (!user || deck.userId !== user.id)) {
      router.push("/decks");
    }

    setLocalStorageCards([], BoardTypes.MAIN);
    setLocalStorageCards([], BoardTypes.SIDE);
    setLocalStorageCards([], BoardTypes.MAYBE);
    setLocalStorageCards([], BoardTypes.ACQUIRE);
    setLocalStorageDashboard({ sections: [] });

    if (deck.format === MTGFormats.COMMANDER) {
      setBracket(getBracketDetails(deck));
    }
    setLegalityEvaluation(evaluateDeckLegality(deck));
  }, [deck]);

  if (!deck) return;

  return (
    <SafeAreaView>
      <DeckHeader deck={deck} bracket={bracket} />

      <View className="flex flex-1 gap-8 lg:px-16 px-4 py-4 border-t-2 border-background-200 bg-background-100">
        {(deck.dashboard?.sections?.length || 0) > 0 ? (
          <TabBar
            tabs={[
              {
                title: "Deck",
                children: (
                  <DeckCardGallery
                    className="py-8"
                    deck={deck}
                    bracket={bracket}
                  />
                ),
              },
              {
                title: "Dashboard",
                children: (
                  <View className="flex-1 flex flex-row flex-wrap gap-6 justify-center items-center mb-8">
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
        ) : (
          <DeckCardGallery deck={deck} bracket={bracket} />
        )}

        {!!deck.description && (
          <>
            <Divider thick />

            <DeckDescription deck={deck} />
          </>
        )}

        <Divider thick />

        <DeckCombos deck={deck} />

        <View className="flex flex-row flex-wrap gap-12">
          <Box
            className="flex-1 min-w-[250px] min-h-[350px] lg:pl-6 !pl-4"
            shade={100}
          >
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

          <DeckChangeLog className="flex-1 min-w-[250px]" deck={deck} />
        </View>

        {!deck.isCollection && <Divider thick />}

        {!deck.isKit && !deck.isCollection && <DeckExampleHand deck={deck} />}

        <DeckTokens deck={deck} />

        {!deck.isCollection && <DeckKits readonly deck={deck} />}
      </View>

      <DeckFooter deck={deck} legalityEvaluation={legalityEvaluation} />

      <Footer />
    </SafeAreaView>
  );
}
