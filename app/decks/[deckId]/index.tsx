import DashboardSectionView from "@/components/dashboard/dashboard-section";
import DeckCardGallery from "@/components/decks/deck-card-gallery";
import DeckChangeLog from "@/components/decks/deck-change-log";
import DeckExampleHand from "@/components/decks/deck-example-hand";
import DeckFooter from "@/components/decks/deck-footer";
import DeckHeader from "@/components/decks/deck-header";
import DeckTokens from "@/components/decks/deck-tokens";
import Graph from "@/components/graph/graph";
import Box from "@/components/ui/box/box";
import Button from "@/components/ui/button/button";
import Divider from "@/components/ui/divider/divider";
import TabBar from "@/components/ui/tabs/tab-bar";
import Text from "@/components/ui/text/text";
import { BoardTypes } from "@/constants/boards";
import { LegalityEvaluation } from "@/constants/mtg/mtg-legality";
import DeckContext from "@/contexts/deck/deck.context";
import { graphCardsByCost } from "@/functions/cards/card-graphing";
import { evaluateDeckLegality } from "@/functions/decks/deck-legality";
import { setLocalStorageCards } from "@/functions/local-storage/card-local-storage";
import { setLocalStorageDashboard } from "@/functions/local-storage/dashboard-local-storage";
import DeckService from "@/hooks/services/deck.service";
import {
  faChartSimple,
  faDatabase,
  faEye,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect } from "react";
import { ScrollView, View } from "react-native";

export default function DeckPage() {
  const { deck, setDeck } = useContext(DeckContext);

  const [legalityEvaluation, setLegalityEvaluation] = React.useState(
    {} as LegalityEvaluation
  );

  const [deckFavorited, setDeckFavorited] = React.useState(false);
  const [deckViewed, setDeckViewed] = React.useState(null as boolean | null);

  const [stacked, setStacked] = React.useState(true);

  useEffect(() => {
    if (!deck) return;

    setLocalStorageCards([], BoardTypes.MAIN);
    setLocalStorageCards([], BoardTypes.SIDE);
    setLocalStorageCards([], BoardTypes.MAYBE);
    setLocalStorageCards([], BoardTypes.ACQUIRE);
    setLocalStorageDashboard({ sections: [] });

    setLegalityEvaluation(evaluateDeckLegality(deck));

    DeckService.getDeckFavorited(deck.id).then((favorited) =>
      setDeckFavorited(favorited)
    );

    DeckService.getDeckViewed(deck.id).then((viewed) => setDeckViewed(viewed));
  }, [deck]);

  if (!deck) return;

  useEffect(() => {
    if (deckViewed === null || deckViewed) return;

    DeckService.addView(deck.id).then((response) => {
      if (response) {
        setDeck({ ...deck, views: deck.views + 1 });
      }
    });
  }, [deckViewed]);

  function addFavorite() {
    if (!deck) return;

    DeckService.addFavorite(deck.id).then((response) => {
      if (response) {
        setDeckFavorited(true);
        setDeck({ ...deck, favorites: deck.favorites + 1 });
      }
    });
  }

  function removeFavorite() {
    if (!deck) return;

    DeckService.removeFavorite(deck.id).then((response) => {
      if (response) {
        setDeckFavorited(false);
        setDeck({ ...deck, favorites: deck.favorites - 1 });
      }
    });
  }

  return (
    <ScrollView className="bg-background-100">
      <DeckHeader deck={deck} />

      <View className="flex flex-1 gap-8 px-16 py-8 border-t-2 border-background-200 bg-background-100">
        <TabBar
          hideBorder
          tabs={[
            {
              title: "Deck",
              children: <DeckCardGallery className="py-8" deck={deck} />,
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
        >
          <View className="flex flex-row">
            <Button rounded text={deck.views + ""} type="clear" icon={faEye} />

            <Button
              rounded
              type="clear"
              icon={faHeart}
              text={deck.favorites + ""}
              onClick={() => (deckFavorited ? removeFavorite() : addFavorite())}
            />
          </View>
        </TabBar>

        {deck.description && (
          <>
            <Divider thick className="!border-background-200" />

            <Text>{deck.description}</Text>
          </>
        )}

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

        {!deck.isKit && <DeckExampleHand deck={deck} />}

        <DeckTokens deck={deck} />
      </View>

      <DeckFooter deck={deck} legalityEvaluation={legalityEvaluation} />
    </ScrollView>
  );
}
