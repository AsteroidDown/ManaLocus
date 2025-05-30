import SpellbookService from "@/hooks/services/spellbook.service";
import { Deck } from "@/models/deck/deck";
import { SpellbookCombo } from "@/models/spellbook/spellbook-combo";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Button from "../ui/button/button";
import Divider from "../ui/divider/divider";
import Text from "../ui/text/text";
import ComboCard from "./combo-card";

export default function DeckCombos({ deck }: { deck: Deck }) {
  const [combos, setCombos] = useState([] as SpellbookCombo[]);
  const [allCombos, setAllCombos] = useState(false);

  useEffect(() => {
    SpellbookService.getCombos(deck).then((combos) =>
      setCombos(
        combos.results.included.sort((a, b) => a.popularity - b.popularity)
      )
    );
  }, [deck]);

  if (!combos?.length) return null;

  return (
    <View className="gap-4">
      <View className="flex flex-row justify-between">
        <Text size="lg" weight="bold">
          Top combos for {deck.name}
        </Text>

        {!allCombos && (
          <Button
            size="sm"
            type="outlined"
            text="Show All"
            onClick={() => setAllCombos(true)}
          />
        )}
      </View>

      <View className="flex flex-row justify-center flex-wrap gap-4">
        {combos?.map((combo, index) => {
          if (allCombos) {
            return <ComboCard key={combo.id} combo={combo} deck={deck} />;
          }
          if (index < 3) {
            return <ComboCard key={combo.id} combo={combo} deck={deck} />;
          }
        })}
      </View>

      <Divider thick className="mt-4" />
    </View>
  );
}
