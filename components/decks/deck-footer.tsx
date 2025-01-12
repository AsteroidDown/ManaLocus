import { groupCardsByType } from "@/functions/cards/card-grouping";
import { currency, titleCase } from "@/functions/text-manipulation";
import { Deck } from "@/models/deck/deck";
import { faCopy, faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import { Image, View } from "react-native";
import CardImportExportModal from "../cards/card-import-export-modal";
import Button from "../ui/button/button";
import Text from "../ui/text/text";
import DeckDuplicateModal from "./deck-duplicate-modal";

export default function DeckFooter({ deck }: { deck: Deck }) {
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
    <View className="sticky bottom-0 flex flex-row gap-4 justify-between items-center px-16 py-4 max-h-14 bg-gradient-to-b from-primary-200 to-primary-100 shadow-[0_0_16px] shadow-background-100">
      <View className="flex flex-row items-center gap-2">
        <Text thickness="bold">{titleCase(deck.format)}</Text>

        <View className="h-5 border-r rounded-lg border-white" />

        <Text>
          {mainCards} Card Mainboard
          {sideCards ? ` + ${sideCards} Card Sideboard` : ""}
        </Text>

        <View className="h-5 border-r rounded-lg border-white" />

        <Text>{currency(totalValue)}</Text>
      </View>

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
    </View>
  );
}
