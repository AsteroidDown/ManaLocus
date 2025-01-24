import Text from "@/components/ui/text/text";
import { MTGRarities, MTGRarity } from "@/constants/mtg/mtg-rarity";
import { titleCase } from "@/functions/text-manipulation";
import { Card, CardFace } from "@/models/card/card";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import CardText from "./card-text";

export interface CardInfoProps {
  card?: Card;
  face?: CardFace;

  link?: boolean;
  onLinkPress?: () => any;
}

export function CardInfo({ card, face, link, onLinkPress }: CardInfoProps) {
  if (!card) return null;

  function getRarityColor(rarity: MTGRarity) {
    if (rarity === MTGRarities.UNCOMMON) return "text-gray-200";
    else if (rarity === MTGRarities.RARE) return "text-yellow-400";
    else if (rarity === MTGRarities.MYTHIC) return "text-orange-500";
    else return "";
  }

  function getCollectorNumber(collectorNumber: string) {
    const number = Number(collectorNumber.replace(/[^0-9]/g, ""));

    if (number < 10) return "00" + collectorNumber;
    else if (number < 100) return "00" + collectorNumber;
    else if (number < 100) return "0" + collectorNumber;
    else return collectorNumber;
  }

  return (
    <View className="flex gap-2 max-w-[400px] -mt-1">
      <View className="flex flex-row justify-between items-center gap-2">
        {link ? (
          <Link href={`/cards/${card.set}/${card.collectorNumber}`}>
            <Pressable tabIndex={-1} onPress={() => onLinkPress?.()}>
              <Text size="2xl" thickness="bold" className="!text-primary-200">
                {face?.name || card.name}
              </Text>
            </Pressable>
          </Link>
        ) : (
          <Text size="2xl" thickness="bold">
            {face?.name || card.name}
          </Text>
        )}

        <CardText size="lg" text={face?.manaCost || card.manaCost} />
      </View>

      <View className="flex gap-2 px-2">
        <View className="flex flex-row justify-between gap-2">
          <Text className="!text-gray-300">
            {face?.typeLine || card.typeLine}
          </Text>

          <Text className={`${getRarityColor(card.rarity)}`}>
            {titleCase(card.rarity)}
          </Text>
        </View>

        <CardText
          text={face?.oracleText || card.oracleText || ""}
          flavor={face?.flavorText || card.flavorText}
        />

        <View className="flex flex-row justify-between items-center gap-2 -mb-2">
          <Text size="sm" className="!text-gray-300 self-end">
            {titleCase(card.rarity)[0]}{" "}
            {getCollectorNumber(card.collectorNumber)} {card.set.toUpperCase()}
          </Text>

          <Text size="lg">
            {face
              ? face.power
                ? `${face.power} / ${face.toughness}`
                : face.loyalty || face.defense
              : card.power
              ? `${card.power} / ${card.toughness}`
              : card.loyalty || card.defense}
          </Text>
        </View>

        <View className="flex flex-row justify-between items-center gap-2">
          <Text className="!text-gray-300">{face?.artist || card.artist}</Text>

          <Text size="sm" className="!text-gray-300">
            {card.releasedAt.split("-")[0]}
          </Text>
        </View>
      </View>
    </View>
  );
}
