import { MTGLegality } from "@/constants/mtg/mtg-legality";
import { ActionColor } from "@/constants/ui/colors";
import { titleCase } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import { View } from "react-native";
import Chip from "../ui/chip/chip";
import Text from "../ui/text/text";

export interface CardLegalitiesProps {
  card?: Card;
}

export function CardLegalities({ card }: CardLegalitiesProps) {
  if (!card) return;

  return (
    <View className="flex-1 flex flex-row flex-wrap gap-4 justify-between">
      <View className="flex-1 flex gap-2 min-w-min">
        <Legality gameType="Standard" legality={card.legalities.standard} />
        <Legality gameType="Pioneer" legality={card.legalities.pioneer} />
        <Legality gameType="Modern" legality={card.legalities.modern} />
        <Legality gameType="Legacy" legality={card.legalities.legacy} />
        <Legality gameType="Vintage" legality={card.legalities.vintage} />
        <Legality gameType="Commander" legality={card.legalities.commander} />
        <Legality
          gameType="Oathbreaker"
          legality={card.legalities.oathbreaker}
        />
      </View>

      <View className="flex-1 flex gap-2 min-w-min">
        <Legality gameType="Alchemy" legality={card.legalities.alchemy} />
        <Legality gameType="Explorer" legality={card.legalities.explorer} />
        <Legality gameType="Historic" legality={card.legalities.historic} />
        <Legality gameType="Timeless" legality={card.legalities.timeless} />
        <Legality gameType="Brawl" legality={card.legalities.brawl} />
        <Legality gameType="Pauper" legality={card.legalities.pauper} />
        <Legality gameType="Penny" legality={card.legalities.penny} />
      </View>
    </View>
  );
}

function Legality({
  gameType,
  legality,
}: {
  gameType: string;
  legality: MTGLegality;
}) {
  function getLegalityColor(legality: MTGLegality): ActionColor {
    return legality === "legal"
      ? "success"
      : legality === "restricted"
      ? "warning"
      : "danger";
  }

  return (
    <View className="flex flex-row items-center justify-between w-full gap-2">
      <Text size="sm" className="flex-1">
        {gameType}
      </Text>

      <Chip
        size="xs"
        text={titleCase(legality).replace("_", " ")}
        action={getLegalityColor(legality)}
      />
    </View>
  );
}
