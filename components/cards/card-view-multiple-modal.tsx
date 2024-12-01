import { MTGColor } from "@/constants/mtg/mtg-colors";
import { MTGRarity } from "@/constants/mtg/mtg-rarity";
import { currency, titleCase } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import { faPlus, faShop } from "@fortawesome/free-solid-svg-icons";
import { Link } from "expo-router";
import React from "react";
import { Linking, View } from "react-native";
import { ChartType } from "../chart/chart";
import Box from "../ui/box/box";
import BoxHeader from "../ui/box/box-header";
import Button from "../ui/button/button";
import Modal from "../ui/modal/modal";
import Placeholder from "../ui/placeholder/placeholder";
import Text from "../ui/text/text";
import CardImage from "./card-image";

export interface CardViewMultipleModalProps {
  cards: Card[];
  color: MTGColor;
  cost?: number;
  rarity?: MTGRarity;
  type?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CardViewMultipleModal({
  cards,
  color,
  cost,
  rarity,
  type,
  open,
  setOpen,
}: CardViewMultipleModalProps) {
  const cellType: ChartType = cost ? "cost" : rarity ? "rarity" : "type";

  const title = `${titleCase(color)} ${
    cellType === "cost"
      ? cost
        ? cost === 6
          ? "6+ Cost "
          : cost + " Cost "
        : " "
      : cellType === "rarity"
      ? rarity
        ? titleCase(rarity) + " "
        : " "
      : type
      ? titleCase(type) + " "
      : ""
  }Cards`;

  const subtitle = `${cards.reduce((acc, card) => acc + card.count, 0)} Card${
    cards.length !== 1 ? "s" : ""
  } | Total Value: ${currency(
    cards.reduce(
      (acc, card) => acc + (card.prices?.usd || card.prices?.eur || 0),
      0
    )
  )}`;

  return (
    <Modal open={open} setOpen={setOpen}>
      <BoxHeader title={title} subtitle={subtitle} />

      <Box className="flex flex-row justify-center flex-wrap gap-2 min-h-[350px] max-h-[80vh] w-fit min-w-[228px] max-w-[1000px] !px-0 overflow-x-auto">
        {cards?.map((card: Card, index: number) => (
          <Box
            key={card.scryfallId + index}
            className="flex gap-1 !bg-background-100 !p-2 max-w-[244px]"
          >
            <View className="flex flex-row gap-2 px-2">
              <Text thickness="bold">{card.count}</Text>
              <Text truncate thickness="bold">
                {card.name}
              </Text>
            </View>

            <CardImage card={card} />

            <View className="flex flex-row gap-2 px-2 pb-1">
              <Button
                size="xs"
                action="info"
                className="flex-1"
                icon={faShop}
                text={`$${card.prices?.usd}`}
                onClick={async () =>
                  await Linking.openURL(card.priceUris.tcgplayer)
                }
              />

              <Button
                size="xs"
                action="info"
                className="flex-1"
                icon={faShop}
                text={`€${card.prices?.eur}`}
                onClick={async () =>
                  await Linking.openURL(card.priceUris.cardmarket)
                }
              />
            </View>
          </Box>
        ))}

        {!cards?.length && (
          <Placeholder
            title="No Cards Found!"
            subtitle={`Add some ${title.toLowerCase()} and they'll show up here!`}
          >
            <Link href="./builder/main-board">
              <Button icon={faPlus} text="Add Cards"></Button>
            </Link>
          </Placeholder>
        )}
      </Box>
    </Modal>
  );
}
