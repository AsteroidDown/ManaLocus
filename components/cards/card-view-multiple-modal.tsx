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
  title?: string;
  color?: MTGColor;
  cost?: number;
  rarity?: MTGRarity;
  type?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CardViewMultipleModal({
  cards,
  title,
  color,
  cost,
  rarity,
  type,
  open,
  setOpen,
}: CardViewMultipleModalProps) {
  const [loadIndex, setLoadIndex] = React.useState(0);

  const cellType: ChartType = cost ? "cost" : rarity ? "rarity" : "type";

  const modalTitle =
    title ??
    `${titleCase(color)} ${
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
      <BoxHeader title={modalTitle} subtitle={subtitle} />

      <Box className="flex flex-row lg:justify-start justify-center gap-2 flex-wrap min-h-[350px] max-h-[75vh] w-fit min-w-[228px] max-w-[1000px] !p-0 !bg-background-100 overflow-x-auto">
        {cards?.map((card, index) => (
          <Box
            key={card.scryfallId + index}
            className="flex gap-2 !p-0 min-w-[244px] max-w-[244px] border-2 border-dark-100 !bg-dark-200 !rounded-lg"
          >
            <View className="-m-1">
              <CardImage
                card={card}
                shouldLoad={loadIndex >= index}
                onLoad={() => {
                  if (index < loadIndex) return;
                  setLoadIndex(index + 1);
                }}
              />
            </View>

            <View className="flex flex-row gap-2 px-2">
              <Text weight="bold">{card.count}</Text>
              <Text truncate weight="bold">
                {card.name}
              </Text>
            </View>

            <View className="flex flex-row gap-2 px-2 pb-2">
              <Button
                size="xs"
                action="info"
                type="outlined"
                className="flex-1"
                icon={faShop}
                text={`$${card.prices?.usd}`}
                onClick={async () =>
                  card.priceUris?.tcgplayer &&
                  (await Linking.openURL(card.priceUris.tcgplayer))
                }
              />

              <Button
                size="xs"
                action="info"
                type="outlined"
                className="flex-1"
                icon={faShop}
                text={`€${card.prices?.eur}`}
                onClick={async () =>
                  card.priceUris?.cardmarket &&
                  (await Linking.openURL(card.priceUris.cardmarket))
                }
              />
            </View>
          </Box>
        ))}

        {!cards?.length && (
          <Placeholder
            title="No Cards Found!"
            subtitle={`Add some ${modalTitle.toLowerCase()} and they'll show up here!`}
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
