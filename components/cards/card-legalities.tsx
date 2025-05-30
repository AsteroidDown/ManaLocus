import { MTGLegality } from "@/constants/mtg/mtg-legality";
import { Card } from "@/models/card/card";
import {
  faBan,
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useWindowDimensions, View } from "react-native";
import Icon from "../ui/icon/icon";
import Text from "../ui/text/text";

export interface CardLegalitiesProps {
  card?: Card;
}

export function CardLegalities({ card }: CardLegalitiesProps) {
  if (!card) return;

  const width = useWindowDimensions().width;

  if (width > 600) {
    return (
      <View className="flex-1 flex flex-row justify-center flex-wrap gap-4">
        <View className="flex-1 flex gap-2 min-w-min">
          <Legality gameType="Standard" legality={card.legalities.standard} />
          <Legality gameType="Pioneer" legality={card.legalities.pioneer} />
          <Legality gameType="Modern" legality={card.legalities.modern} />
          <Legality gameType="Legacy" legality={card.legalities.legacy} />
          <Legality gameType="Vintage" legality={card.legalities.vintage} />
        </View>

        <View className="flex-1 flex gap-2 min-w-min">
          <Legality gameType="Commander" legality={card.legalities.commander} />
          <Legality
            gameType="Oathbreaker"
            legality={card.legalities.oathbreaker}
          />
          <Legality gameType="Pauper" legality={card.legalities.pauper} />
          <Legality
            gameType="Pauper EDH"
            legality={card.legalities.paupercommander}
          />
          <Legality gameType="Penny" legality={card.legalities.penny} />
        </View>

        <View className="flex-1 flex gap-2 min-w-min">
          <Legality gameType="Alchemy" legality={card.legalities.alchemy} />
          <Legality gameType="Explorer" legality={card.legalities.explorer} />
          <Legality gameType="Historic" legality={card.legalities.historic} />
          <Legality gameType="Timeless" legality={card.legalities.timeless} />
          <Legality gameType="Brawl" legality={card.legalities.brawl} />
        </View>
      </View>
    );
  } else {
    return (
      <View className="flex-1 flex flex-row justify-center flex-wrap gap-4">
        <View className="flex-1 flex gap-2 min-w-min">
          <Legality gameType="Standard" legality={card.legalities.standard} />
          <Legality gameType="Pioneer" legality={card.legalities.pioneer} />
          <Legality gameType="Modern" legality={card.legalities.modern} />
          <Legality gameType="Legacy" legality={card.legalities.legacy} />
          <Legality gameType="Vintage" legality={card.legalities.vintage} />
          <Legality gameType="Alchemy" legality={card.legalities.alchemy} />
          <Legality gameType="Historic" legality={card.legalities.historic} />
          <Legality gameType="Timeless" legality={card.legalities.timeless} />
        </View>

        <View className="flex-1 flex gap-2 min-w-min">
          <Legality gameType="Commander" legality={card.legalities.commander} />
          <Legality
            gameType="Oathbreaker"
            legality={card.legalities.oathbreaker}
          />
          <Legality gameType="Pauper" legality={card.legalities.pauper} />
          <Legality
            gameType="Pauper EDH"
            legality={card.legalities.paupercommander}
          />
          <Legality gameType="Explorer" legality={card.legalities.explorer} />
          <Legality gameType="Penny" legality={card.legalities.penny} />
          <Legality gameType="Brawl" legality={card.legalities.brawl} />
        </View>
      </View>
    );
  }
}

function Legality({
  gameType,
  legality,
}: {
  gameType: string;
  legality: MTGLegality;
}) {
  const legalityColor =
    legality === "legal"
      ? "bg-success-100"
      : legality === "restricted"
      ? "bg-warning-100"
      : legality === "banned"
      ? "bg-danger-100"
      : "bg-dark-400";

  return (
    <View className="flex flex-row items-center justify-between w-full gap-2 px-1">
      <View
        className={`${legalityColor} flex justify-center items-center w-5 h-5 p-px rounded-full`}
      >
        <Icon
          className="!text-dark-100"
          icon={
            legality === "legal"
              ? faCircleCheck
              : legality === "restricted"
              ? faCircleInfo
              : legality === "banned"
              ? faCircleXmark
              : faBan
          }
        />
      </View>

      <Text className="flex-1">{gameType}</Text>
    </View>
  );
}
