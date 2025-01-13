import { MTGColorSymbol } from "@/constants/mtg/mtg-colors";
import { MTGFormat, MTGFormats } from "@/constants/mtg/mtg-format";
import { MTGLegalities } from "@/constants/mtg/mtg-legality";
import { groupCardsByColorMulti } from "@/functions/cards/card-grouping";
import { currency, titleCase } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import { faShop } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import { Linking, Pressable, View } from "react-native";
import CardDetailedPreview from "../cards/card-detailed-preview";
import CardImage from "../cards/card-image";
import CardText from "../cards/card-text";
import CardViewMultipleModal from "../cards/card-view-multiple-modal";
import Button from "../ui/button/button";
import Divider from "../ui/divider/divider";
import Modal from "../ui/modal/modal";
import Text from "../ui/text/text";
import {
  DeckCardGalleryViewType,
  DeckCardGalleryViewTypes,
} from "./deck-card-gallery";

export interface DeckColumnCardGrouping {
  title: string;
  cards: Card[];
  count: number;
  price: number;
}

export interface DeckColumnProps {
  title: string;
  cards?: Card[];
  format?: MTGFormat;
  viewType: DeckCardGalleryViewType;

  showPrice?: boolean;
  showManaValue?: boolean;
  groupMulticolored?: boolean;
  hideCount?: boolean;
  commander?: boolean;
  colorIdentity?: MTGColorSymbol[];
  shouldWrap?: boolean;
}

export default function DeckColumn({
  title,
  cards,
  format,
  viewType,

  showPrice,
  showManaValue,
  groupMulticolored,
  hideCount,
  commander,
  colorIdentity,
  shouldWrap,
}: DeckColumnProps) {
  const [count, setCount] = React.useState(0);
  const [price, setPrice] = React.useState(0);

  const [cardPreviewModalOpen, setCardPreviewModalOpen] = React.useState(false);

  const [cardGroupings, setCardGroupings] = React.useState(
    [] as DeckColumnCardGrouping[] | null
  );

  React.useEffect(() => {
    setCount(cards?.reduce((acc, card) => acc + card.count, 0) || 0);
    setPrice(
      cards?.reduce((acc, card) => acc + (card.prices?.usd || 0), 0) || 0
    );
  }, [cards]);

  React.useEffect(() => {
    if (!cards?.length || !groupMulticolored) return;

    const cardGroupings = [] as DeckColumnCardGrouping[];
    const groupedCards = groupCardsByColorMulti(cards);

    Object.keys(groupedCards).forEach((key: string) => {
      cardGroupings.push({
        title: titleCase(key),
        cards: (groupedCards as any)[key],
        count:
          (groupedCards as any)[key]?.reduce(
            (acc: number, card: Card) => (acc += card.count),
            0
          ) || 0,
        price:
          (groupedCards as any)[key]?.reduce(
            (acc: number, card: Card) => (acc += card.prices?.usd || 0),
            0
          ) || 0,
      });
    });

    setCardGroupings(cardGroupings);
  }, [cards, groupMulticolored]);

  return (
    <View
      className={`${
        shouldWrap ? "break-before-column" : ""
      } w-full break-inside-avoid mb-6`}
    >
      <Pressable
        className="flex flex-row justify-between items-center px-2"
        onPress={() => setCardPreviewModalOpen(true)}
      >
        <Text size="lg" thickness="bold">
          {titleCase(title)}
        </Text>

        <View className="flex flex-row gap-2">
          {!commander && <Text>{count}</Text>}

          {showPrice && (
            <Text className="w-14 text-right">{currency(price)}</Text>
          )}
        </View>
      </Pressable>

      <Divider thick className="!border-background-200 my-1" />

      {!groupMulticolored && (
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
              colorIdentity={colorIdentity}
            />
          ))}
        </View>
      )}

      {groupMulticolored && (cardGroupings?.length || 0) > 0 && (
        <View className="flex gap-1">
          {cardGroupings?.map((group, index) => (
            <View key={index + group.title} className="mt-1">
              {!commander && group.title !== title && (
                <View className="flex flex-row justify-between items-center px-2">
                  <Text thickness="semi">{titleCase(group.title)}</Text>

                  <View className="flex flex-row gap-2">
                    {!commander && <Text>{group.count}</Text>}

                    {showPrice && (
                      <Text className="w-14 text-right">
                        {currency(group.price)}
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {!commander && group.title !== title && (
                <Divider className="!border-background-200 my-1" />
              )}

              <View
                className={`${
                  group.title === title ? "-mt-1" : ""
                } flex gap-0.5`}
              >
                {group.cards.map((card, cardIndex) => (
                  <DeckCard
                    key={card.scryfallId + cardIndex}
                    card={card}
                    last={index === cardGroupings.length - 1}
                    format={format}
                    viewType={viewType}
                    showPrice={showPrice}
                    showManaValue={showManaValue}
                    hideCount={hideCount}
                    commander={commander}
                    colorIdentity={colorIdentity}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      <CardViewMultipleModal
        title={title}
        cards={cards || []}
        open={cardPreviewModalOpen}
        setOpen={setCardPreviewModalOpen}
      />
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
  colorIdentity?: MTGColorSymbol[];
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
  colorIdentity,
}: DeckCardProps) {
  const [open, setOpen] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState(-1);

  const [banned, setBanned] = React.useState(false);
  const [restricted, setRestricted] = React.useState(false);

  const cardCount = Array(card.count).fill(undefined);

  useEffect(() => {
    if (!format || format === MTGFormats.CUBE) return;

    if (
      colorIdentity &&
      !card.colorIdentity.every((color) => colorIdentity.includes(color))
    ) {
      setBanned(true);
    }

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
              {!hideCount && !commander && (
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
