import { currency } from "@/functions/text-manipulation";
import { Deck } from "@/models/deck/deck";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import { View } from "react-native";
import CardImportExportModal from "../cards/card-import-export-modal";
import Button from "../ui/button/button";
import Text from "../ui/text/text";

export default function DeckFooter({ deck }: { deck: Deck }) {
  const [importOpen, setImportOpen] = React.useState(false);

  const [mainCards, setMainCards] = React.useState(0);
  const [sideCards, setSideCards] = React.useState(0);
  const [totalValue, setTotalValue] = React.useState(0);

  useEffect(() => {
    if (!deck) return;

    setMainCards(deck.main.reduce((acc, card) => acc + card.count, 0));
    setSideCards(deck.side.reduce((acc, card) => acc + card.count, 0));
    setTotalValue(
      deck.main.reduce((acc, card) => acc + (card.prices?.usd ?? 0), 0)
    );
  }, [deck]);

  return (
    <View className="sticky bottom-0 flex flex-row gap-4 justify-between items-center px-8 py-4 max-h-14 bg-primary-200">
      <View className="flex flex-row items-center gap-2">
        <Text size="sm">
          {mainCards} Card Mainboard
          {sideCards ? ` + ${sideCards} Card Sideboard` : ""}
        </Text>

        <View className="h-full border-r-2 border-white" />

        <Text size="sm">{currency(totalValue)}</Text>
      </View>

      <View className="flex flex-row gap-2">
        <Button
          rounded
          type="clear"
          action="default"
          icon={faFileArrowDown}
          onClick={() => setImportOpen(true)}
        />

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
