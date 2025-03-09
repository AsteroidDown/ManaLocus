import { LegalityEvaluation } from "@/constants/mtg/mtg-legality";
import { groupCardsByType } from "@/functions/cards/card-grouping";
import { currency, titleCase } from "@/functions/text-manipulation";
import { Deck } from "@/models/deck/deck";
import {
  faCheckCircle,
  faCircleXmark,
  faCopy,
  faFileArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import { Image, useWindowDimensions, View } from "react-native";
import CardImportExportModal from "../cards/card-import-export-modal";
import Box from "../ui/box/box";
import Button from "../ui/button/button";
import Dropdown from "../ui/dropdown/dropdown";
import Text from "../ui/text/text";
import DeckDuplicateModal from "./deck-duplicate-modal";
import DeckLegalityInfo from "./deck-legality-info";

export interface DeckFooterProps {
  deck: Deck;
  legalityEvaluation: LegalityEvaluation;
}

export default function DeckFooter({
  deck,
  legalityEvaluation,
}: DeckFooterProps) {
  const width = useWindowDimensions().width;

  const [legalityOpen, setLegalityOpen] = React.useState(false);
  const [copyOpen, setCopyOpen] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);

  const [mainCards, setMainCards] = React.useState(0);
  const [sideCards, setSideCards] = React.useState(0);
  const [totalValue, setTotalValue] = React.useState(0);

  const [creatureCount, setCreatureCount] = React.useState(0);
  const [instantCount, setInstantCount] = React.useState(0);
  const [sorceryCount, setSorceryCount] = React.useState(0);
  const [artifactCount, setArtifactCount] = React.useState(0);
  const [enchantmentCount, setEnchantmentCount] = React.useState(0);
  const [planeswalkerCount, setPlaneswalkerCount] = React.useState(0);
  const [battleCount, setBattleCount] = React.useState(0);
  const [landCount, setLandCount] = React.useState(0);

  useEffect(() => {
    if (!deck) return;

    setMainCards(deck.main.reduce((acc, card) => acc + card.count, 0));
    setSideCards(deck.side.reduce((acc, card) => acc + card.count, 0));
    setTotalValue(
      deck.main.reduce(
        (acc, card) => acc + (card.prices?.usd ?? 0) * card.count,
        0
      )
    );

    const groupedCards = groupCardsByType(deck.main);

    setCreatureCount(
      groupedCards.creature?.reduce((acc, card) => (acc += card.count), 0) || 0
    );
    setInstantCount(
      groupedCards.instant?.reduce((acc, card) => (acc += card.count), 0) || 0
    );
    setSorceryCount(
      groupedCards.sorcery?.reduce((acc, card) => (acc += card.count), 0) || 0
    );
    setArtifactCount(
      groupedCards.artifact?.reduce((acc, card) => (acc += card.count), 0) || 0
    );
    setEnchantmentCount(
      groupedCards.enchantment?.reduce((acc, card) => (acc += card.count), 0) ||
        0
    );
    setPlaneswalkerCount(
      groupedCards.planeswalker?.reduce(
        (acc, card) => (acc += card.count),
        0
      ) || 0
    );
    setBattleCount(
      groupedCards.battle?.reduce((acc, card) => (acc += card.count), 0) || 0
    );
    setLandCount(
      groupedCards.land?.reduce((acc, card) => (acc += card.count), 0) || 0
    );
  }, [deck]);

  return (
    <View className="sticky bottom-[-1px] flex flex-row gap-4 justify-between items-center lg:px-16 px-4 py-4 max-h-14 bg-gradient-to-b from-primary-200 to-primary-100 shadow-[0_0_16px] shadow-background-100">
      <View className="flex flex-row lg:justify-start justify-around lg:w-fit w-full items-center gap-2">
        {!deck.isCollection && !deck.isKit && (
          <>
            <View className="flex flex-row items-center gap-2">
              <Text thickness="bold">{titleCase(deck.format)}</Text>

              <Button
                rounded
                type="clear"
                action="default"
                className="-ml-3.5 -mr-2"
                icon={legalityEvaluation.legal ? faCheckCircle : faCircleXmark}
                onClick={() => setLegalityOpen(!legalityOpen)}
              >
                <View className="-mx-1.5 -mb-6">
                  <Dropdown
                    xOffset={-132}
                    expanded={legalityOpen}
                    setExpanded={setLegalityOpen}
                  >
                    <Box className="flex justify-start items-start border-2 border-primary-300 !bg-background-100 !bg-opacity-90 overflow-auto max-w-[450px]">
                      <DeckLegalityInfo
                        format={deck.format}
                        legalityEvaluation={legalityEvaluation}
                      />
                    </Box>
                  </Dropdown>
                </View>
              </Button>
            </View>

            <View className="h-5 border-r rounded-lg border-white" />
          </>
        )}

        <Text>
          {mainCards} {width > 600 ? "Card Mainboard" : "Main"}
          {sideCards
            ? ` + ${sideCards} ${width > 600 ? "Card Sideboard" : "Side"}`
            : ""}
        </Text>

        <View className="h-5 border-r rounded-lg border-white" />

        <Text>{currency(totalValue)}</Text>
      </View>

      {width > 600 && (
        <View className="flex flex-row items-center gap-4">
          <View className="flex flex-row items-center gap-2">
            <Image
              resizeMode="contain"
              className="max-h-4 max-w-4"
              source={require("assets/mtg-types/creature.png")}
            />

            <Text>{creatureCount}</Text>
          </View>

          <View className="flex flex-row items-center gap-2">
            <Image
              resizeMode="contain"
              className="max-h-4 max-w-4"
              source={require("assets/mtg-types/instant.png")}
            />

            <Text>{instantCount}</Text>
          </View>

          <View className="flex flex-row items-center gap-2">
            <Image
              resizeMode="contain"
              className="max-h-4 max-w-4"
              source={require("assets/mtg-types/sorcery.png")}
            />

            <Text>{sorceryCount}</Text>
          </View>

          <View className="flex flex-row items-center gap-2">
            <Image
              resizeMode="contain"
              className="max-h-4 max-w-4"
              source={require("assets/mtg-types/artifact.png")}
            />

            <Text>{artifactCount}</Text>
          </View>

          <View className="flex flex-row items-center gap-2">
            <Image
              resizeMode="contain"
              className="max-h-4 max-w-4"
              source={require("assets/mtg-types/enchantment.png")}
            />

            <Text>{enchantmentCount}</Text>
          </View>

          {planeswalkerCount > 0 && (
            <View className="flex flex-row items-center gap-2">
              <Image
                resizeMode="contain"
                className="max-h-4 max-w-4"
                source={require("assets/mtg-types/planeswalker.png")}
              />

              <Text>{planeswalkerCount}</Text>
            </View>
          )}

          {battleCount > 0 && (
            <View className="flex flex-row items-center gap-2">
              <Image
                resizeMode="contain"
                className="max-h-4 max-w-4"
                source={require("assets/mtg-types/battle.png")}
              />

              <Text>{battleCount}</Text>
            </View>
          )}

          <View className="flex flex-row items-center gap-2">
            <Image
              resizeMode="contain"
              className="max-h-4 max-w-4"
              source={require("assets/mtg-types/land.png")}
            />

            <Text>{landCount}</Text>
          </View>

          <View className="h-5 border-r rounded-lg border-white -mr-2 ml-1" />

          <View className="flex flex-row">
            <Button
              rounded
              type="clear"
              action="default"
              icon={faCopy}
              onClick={() => setCopyOpen(true)}
            />

            <Button
              rounded
              type="clear"
              action="default"
              icon={faFileArrowDown}
              onClick={() => setImportOpen(true)}
            />
          </View>

          <View className="-mx-2">
            <DeckDuplicateModal
              deck={deck}
              open={copyOpen}
              setOpen={setCopyOpen}
            />
          </View>

          <View className="-mx-2">
            <CardImportExportModal
              exportOnly
              open={importOpen}
              setOpen={setImportOpen}
              exportCards={deck.main}
              exportSideboard={deck.side}
            />
          </View>
        </View>
      )}
    </View>
  );
}
