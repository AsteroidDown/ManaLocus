import { titleCase } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import { faList, faShop } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "expo-router";
import React from "react";
import { Linking, Pressable, View } from "react-native";
import CardDetailedPreview from "../cards/card-detailed-preview";
import CardImage from "../cards/card-image";
import CardText from "../cards/card-text";
import Button from "../ui/button/button";
import Divider from "../ui/divider/divider";
import Modal from "../ui/modal/modal";
import Text from "../ui/text/text";
import {
  DeckCardGalleryViewType,
  DeckCardGalleryViewTypes,
} from "./deck-card-gallery";

export interface DeckColumnProps {
  title: string;
  cards?: Card[];
  viewType: DeckCardGalleryViewType;

  hideCount?: boolean;
  shouldWrap?: boolean;
}

export default function DeckColumn({
  title,
  cards,
  viewType,

  hideCount,
  shouldWrap,
}: DeckColumnProps) {
  return (
    <View
      className={`${
        shouldWrap ? "break-before-column" : ""
      } w-full break-inside-avoid mb-6`}
    >
      <View className="flex flex-row justify-between items-center px-2">
        <Text size="lg" thickness="bold">
          {titleCase(title)}
        </Text>

        <Text>{cards?.reduce((acc, card) => acc + card.count, 0)}</Text>
      </View>

      <Divider thick className="!border-background-200 my-1" />

      <View className="flex gap-0.5">
        {cards?.map((card, index) => (
          <DeckCard
            key={index}
            card={card}
            last={index === cards.length - 1}
            viewType={viewType}
            hideCount={hideCount}
          />
        ))}
      </View>
    </View>
  );
}

interface DeckCardProps {
  card: Card;
  last: boolean;
  viewType: DeckCardGalleryViewType;

  hideCount?: boolean;
}

function DeckCard({
  card,
  last,
  viewType,

  hideCount,
}: DeckCardProps) {
  const navigation = useNavigation();

  const [open, setOpen] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState(-1);

  const cardCount = Array(card.count).fill(undefined);

  return (
    <>
      {viewType === DeckCardGalleryViewTypes.LIST && (
        <Pressable
          className="flex flex-row gap-2 justify-between items-center px-2 py-0.5 rounded-full hover:bg-primary-200 transition-all duration-300"
          onPress={() => setOpen(true)}
        >
          <View className="flex-1 flex flex-row items-center gap-2">
            {!hideCount && <Text>{card.count}</Text>}

            <Text truncate thickness="medium">
              {card.name}
            </Text>
          </View>

          <CardText
            text={
              card.faces
                ? card.faces.front.manaCost && card.faces.back.manaCost
                  ? `${card.faces.front.manaCost} // ${card.faces.back.manaCost}`
                  : card.faces.front.manaCost || card.faces.back.manaCost
                : card.manaCost
            }
          />
        </Pressable>
      )}

      {viewType === DeckCardGalleryViewTypes.CARD &&
        cardCount.map((_, index) => (
          <Pressable
            key={index}
            onPress={() => setOpen(true)}
            onPointerEnter={() => setHoveredIndex(index)}
            onPointerLeave={() => setHoveredIndex(-1)}
            className={`${hoveredIndex === index ? "z-[100]" : "z-0"} ${
              !(last && index === card.count - 1) ? "max-h-8" : ""
            } max-w-fit mx-auto`}
          >
            <CardImage card={card} />
          </Pressable>
        ))}

      <View className="-mt-0.5">
        <Modal open={open} setOpen={setOpen}>
          <CardDetailedPreview
            link
            onLinkPress={() => setOpen(false)}
            card={card}
            className="!p-0"
          >
            <View className="flex flex-row gap-2">
              <Button
                size="sm"
                action="info"
                className="flex-1"
                icon={faShop}
                text={`$${card.prices?.usd}`}
                onClick={async () =>
                  card.priceUris?.tcgplayer &&
                  (await Linking.openURL(card.priceUris.tcgplayer))
                }
              />

              <Button
                size="sm"
                action="info"
                className="flex-1"
                icon={faShop}
                text={`€${card.prices?.eur}`}
                onClick={async () =>
                  card.priceUris?.cardmarket &&
                  (await Linking.openURL(card.priceUris.cardmarket))
                }
              />
            </View>

            <Button
              text="More Details"
              className="flex-1 w-full"
              icon={faList}
              // onClick={() =>
              //   navigation.navigate(`cards/${card.set}/${card.collectorNumber}`)
              // }
            />
          </CardDetailedPreview>
        </Modal>
      </View>
    </>
  );
}
