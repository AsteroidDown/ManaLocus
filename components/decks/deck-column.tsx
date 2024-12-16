import { MTGFormat, MTGFormats } from "@/constants/mtg/mtg-format";
import { MTGLegalities } from "@/constants/mtg/mtg-legality";
import { currency, titleCase } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import { faShop } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
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
  format?: MTGFormat;
  viewType: DeckCardGalleryViewType;

  showPrice?: boolean;
  showManaValue?: boolean;
  hideCount?: boolean;
  commander?: boolean;
  shouldWrap?: boolean;
}

export default function DeckColumn({
  title,
  cards,
  format,
  viewType,

  showPrice,
  showManaValue,
  hideCount,
  commander,
  shouldWrap,
}: DeckColumnProps) {
  const [count, setCount] = React.useState(0);
  const [price, setPrice] = React.useState(0);

  React.useEffect(() => {
    setCount(cards?.reduce((acc, card) => acc + card.count, 0) || 0);
    setPrice(
      cards?.reduce((acc, card) => acc + (card.prices?.usd || 0), 0) || 0
    );
  }, [cards]);

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

        <View className="flex flex-row gap-2">
          <Text>{count}</Text>

          {showPrice && (
            <Text className="w-14 text-right">{currency(price)}</Text>
          )}
        </View>
      </View>

      <Divider thick className="!border-background-200 my-1" />

      <View className="flex gap-0.5">
        {cards?.map((card, index) => (
          <DeckCard
            key={index}
            card={card}
            last={index === cards.length - 1}
            format={format}
            viewType={viewType}
            showPrice={showPrice}
            showManaValue={showManaValue}
            hideCount={hideCount}
            commander={commander}
          />
        ))}
      </View>
    </View>
  );
}

interface DeckCardProps {
  card: Card;
  last: boolean;
  format?: MTGFormat;
  viewType: DeckCardGalleryViewType;

  showPrice?: boolean;
  showManaValue?: boolean;
  hideCount?: boolean;
  commander?: boolean;
}

function DeckCard({
  card,
  last,
  format,
  viewType,
  showPrice,
  showManaValue,
  hideCount,
  commander,
}: DeckCardProps) {
  const [open, setOpen] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState(-1);

  const [banned, setBanned] = React.useState(false);
  const [restricted, setRestricted] = React.useState(false);

  const cardCount = Array(card.count).fill(undefined);

  useEffect(() => {
    if (!format || format === MTGFormats.CUBE) return;

    if (
      card.legalities[format] === MTGLegalities.BANNED ||
      card.legalities[format] === MTGLegalities.NOT_LEGAL
    ) {
      setBanned(true);
    } else if (card.legalities[format] === MTGLegalities.RESTRICTED) {
      setRestricted(true);
    }
  }, [card]);

  return (
    <>
      {viewType === DeckCardGalleryViewTypes.LIST && (
        <Pressable
          className={`${
            commander
              ? "border-2 hover:border-primary-200 border-transparent"
              : ""
          } flex hover:bg-primary-200 rounded-xl overflow-hidden transition-all duration-300`}
          onPress={() => setOpen(true)}
        >
          <View className="flex flex-row gap-2 justify-between items-center px-2 py-0.5">
            <View className="flex-1 flex flex-row items-center gap-2">
              {!hideCount && (
                <Text
                  className={`${
                    banned
                      ? "!text-red-500"
                      : restricted
                      ? "!text-orange-500"
                      : ""
                  }`}
                >
                  {card.count}
                </Text>
              )}

              <Text
                truncate
                thickness="medium"
                className={`${
                  banned
                    ? "!text-red-500"
                    : restricted
                    ? "!text-orange-500"
                    : ""
                }`}
              >
                {card.name}
              </Text>
            </View>

            {showManaValue && (
              <CardText
                text={
                  card.faces
                    ? card.faces.front.manaCost && card.faces.back.manaCost
                      ? `${card.faces.front.manaCost} // ${card.faces.back.manaCost}`
                      : card.faces.front.manaCost || card.faces.back.manaCost
                    : card.manaCost
                }
              />
            )}

            {showPrice && (
              <Text className="w-14 text-right">
                {currency(card.prices?.usd)}
              </Text>
            )}
          </View>

          {commander && (
            <View className="flex flex-row justify-center pt-2 bg-background-100">
              <CardImage card={card} />
            </View>
          )}
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
          >
            <View className="flex flex-row gap-2">
              <Button
                size="xs"
                action="info"
                className="flex-1"
                icon={faShop}
                text={`$${card.prices?.usd || "0.00"}`}
                onClick={async () =>
                  card.priceUris?.tcgplayer &&
                  (await Linking.openURL(card.priceUris.tcgplayer))
                }
              />

              <Button
                size="xs"
                action="info"
                className="flex-1"
                icon={faShop}
                text={`€${card.prices?.eur || "0.00"}`}
                onClick={async () =>
                  card.priceUris?.cardmarket &&
                  (await Linking.openURL(card.priceUris.cardmarket))
                }
              />
            </View>
          </CardDetailedPreview>
        </Modal>
      </View>
    </>
  );
}
