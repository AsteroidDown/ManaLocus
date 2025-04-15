import { LegalityEvaluation } from "@/constants/mtg/mtg-legality";
import { PreferenceColor } from "@/constants/ui/colors";
import UserPreferencesContext from "@/contexts/user/user-preferences.context";
import UserContext from "@/contexts/user/user.context";
import { groupCardsByType } from "@/functions/cards/card-grouping";
import { currency, titleCase } from "@/functions/text-manipulation";
import { Deck } from "@/models/deck/deck";
import {
  faCheckCircle,
  faCircleXmark,
  faCopy,
  faFileArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect, useState } from "react";
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
  const { user } = useContext(UserContext);
  const { preferences } = useContext(UserPreferencesContext);

  const width = useWindowDimensions().width;

  const [legalityOpen, setLegalityOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const [mainCards, setMainCards] = useState(0);
  const [sideCards, setSideCards] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  const [creatureCount, setCreatureCount] = useState(0);
  const [instantCount, setInstantCount] = useState(0);
  const [sorceryCount, setSorceryCount] = useState(0);
  const [artifactCount, setArtifactCount] = useState(0);
  const [enchantmentCount, setEnchantmentCount] = useState(0);
  const [planeswalkerCount, setPlaneswalkerCount] = useState(0);
  const [battleCount, setBattleCount] = useState(0);
  const [landCount, setLandCount] = useState(0);

  const darkText =
    preferences?.color &&
    [
      PreferenceColor.LIME,
      PreferenceColor.YELLOW,
      PreferenceColor.PINK,
      PreferenceColor.TEAL,
      PreferenceColor.GRAY,
    ].includes(preferences?.color)
      ? true
      : false;

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
              <Text
                weight="bold"
                className={darkText ? "!text-background-300" : ""}
              >
                {titleCase(deck.format)}
              </Text>

              <Button
                rounded
                type="clear"
                dark={darkText}
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
                    <Box className="flex justify-start items-start border-2 border-primary-300 !bg-background-300 !bg-opacity-90 overflow-auto max-w-[450px]">
                      <DeckLegalityInfo
                        format={deck.format}
                        legalityEvaluation={legalityEvaluation}
                      />
                    </Box>
                  </Dropdown>
                </View>
              </Button>
            </View>

            <View
              className={`h-5 border-r rounded-lg ${
                darkText ? "border-background-300" : "border-white"
              }`}
            />
          </>
        )}

        <Text
          weight="medium"
          className={darkText ? "!text-background-300" : ""}
        >
          {mainCards} {width > 600 ? "Card Mainboard" : "Main"}
          {sideCards
            ? ` + ${sideCards} ${width > 600 ? "Card Sideboard" : "Side"}`
            : ""}
        </Text>

        <View
          className={`h-5 border-r rounded-lg ${
            darkText ? "border-background-300" : "border-white"
          }`}
        />

        <Text
          weight="medium"
          className={darkText ? "!text-background-300" : ""}
        >
          {currency(totalValue)}
        </Text>
      </View>

      {width > 600 && (
        <View className="flex flex-row items-center gap-4">
          <View className="flex flex-row items-center gap-2">
            <Image
              resizeMode="contain"
              className="max-h-4 max-w-4"
              source={
                darkText
                  ? require("assets/mtg-types/creature-dark.png")
                  : require("assets/mtg-types/creature.png")
              }
            />

            <Text
              weight="medium"
              className={darkText ? "!text-background-300" : ""}
            >
              {creatureCount}
            </Text>
          </View>

          <View className="flex flex-row items-center gap-2">
            <Image
              resizeMode="contain"
              className="max-h-4 max-w-4"
              source={
                darkText
                  ? require("assets/mtg-types/instant-dark.png")
                  : require("assets/mtg-types/instant.png")
              }
            />

            <Text
              weight="medium"
              className={darkText ? "!text-background-300" : ""}
            >
              {instantCount}
            </Text>
          </View>

          <View className="flex flex-row items-center gap-2">
            <Image
              resizeMode="contain"
              className="max-h-4 max-w-4"
              source={
                darkText
                  ? require("assets/mtg-types/sorcery-dark.png")
                  : require("assets/mtg-types/sorcery.png")
              }
            />

            <Text
              weight="medium"
              className={darkText ? "!text-background-300" : ""}
            >
              {sorceryCount}
            </Text>
          </View>

          <View className="flex flex-row items-center gap-2">
            <Image
              resizeMode="contain"
              className="max-h-4 max-w-4"
              source={
                darkText
                  ? require("assets/mtg-types/artifact-dark.png")
                  : require("assets/mtg-types/artifact.png")
              }
            />

            <Text
              weight="medium"
              className={darkText ? "!text-background-300" : ""}
            >
              {artifactCount}
            </Text>
          </View>

          <View className="flex flex-row items-center gap-2">
            <Image
              resizeMode="contain"
              className="max-h-4 max-w-4"
              source={
                darkText
                  ? require("assets/mtg-types/enchantment-dark.png")
                  : require("assets/mtg-types/enchantment.png")
              }
            />

            <Text
              weight="medium"
              className={darkText ? "!text-background-300" : ""}
            >
              {enchantmentCount}
            </Text>
          </View>

          {planeswalkerCount > 0 && (
            <View className="flex flex-row items-center gap-2">
              <Image
                resizeMode="contain"
                className="max-h-4 max-w-4"
                source={
                  darkText
                    ? require("assets/mtg-types/planeswalker-dark.png")
                    : require("assets/mtg-types/planeswalker.png")
                }
              />

              <Text
                weight="medium"
                className={darkText ? "!text-background-300" : ""}
              >
                {planeswalkerCount}
              </Text>
            </View>
          )}

          {battleCount > 0 && (
            <View className="flex flex-row items-center gap-2">
              <Image
                resizeMode="contain"
                className="max-h-4 max-w-4"
                source={
                  darkText
                    ? require("assets/mtg-types/battle-dark.png")
                    : require("assets/mtg-types/battle.png")
                }
              />

              <Text
                weight="medium"
                className={darkText ? "!text-background-300" : ""}
              >
                {battleCount}
              </Text>
            </View>
          )}

          <View className="flex flex-row items-center gap-2">
            <Image
              resizeMode="contain"
              className="max-h-4 max-w-4"
              source={
                darkText
                  ? require("assets/mtg-types/land-dark.png")
                  : require("assets/mtg-types/land.png")
              }
            />

            <Text
              weight="medium"
              className={darkText ? "!text-background-300" : ""}
            >
              {landCount}
            </Text>
          </View>

          <View
            className={`h-5 border-r rounded-lg ${
              darkText ? "border-background-300" : "border-white"
            }`}
          />

          <View className="flex flex-row">
            <Button
              rounded
              type="clear"
              icon={faCopy}
              action="default"
              dark={darkText}
              onClick={() => setCopyOpen(true)}
            />

            <Button
              rounded
              type="clear"
              dark={darkText}
              action="default"
              icon={faFileArrowDown}
              onClick={() => setImportOpen(true)}
            />
          </View>

          {user && user.verified && (
            <View className="-mx-2">
              <DeckDuplicateModal
                deck={deck}
                open={copyOpen}
                setOpen={setCopyOpen}
              />
            </View>
          )}

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
