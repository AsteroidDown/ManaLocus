import { MTGColorSymbol } from "@/constants/mtg/mtg-colors";
import { MTGFormat, MTGFormats } from "@/constants/mtg/mtg-format";
import { groupCardsByColorMulti } from "@/functions/cards/card-grouping";
import { evaluateCardLegality } from "@/functions/decks/deck-legality";
import { currency, titleCase } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import {
  DeckCardGalleryViewType,
  DeckCardGalleryViewTypes,
} from "@/models/deck/deck-gallery-filters";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import CardDetailedPreview from "../cards/card-detailed-preview";
import CardImage from "../cards/card-image";
import CardText from "../cards/card-text";
import CardViewMultipleModal from "../cards/card-view-multiple-modal";
import Divider from "../ui/divider/divider";
import Modal from "../ui/modal/modal";
import Text from "../ui/text/text";

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
  const [count, setCount] = useState(0);
  const [price, setPrice] = useState(0);

  const [cardPreviewModalOpen, setCardPreviewModalOpen] = useState(false);

  const [cardGroupings, setCardGroupings] = useState(
    [] as DeckColumnCardGrouping[] | null
  );

  useEffect(() => {
    setCount(cards?.reduce((acc, card) => acc + card.count, 0) || 0);
    setPrice(
      cards?.reduce((acc, card) => acc + (card.prices?.usd || 0), 0) || 0
    );
  }, [cards]);

  useEffect(() => {
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
        className="flex flex-row justify-between items-center px-2 border-b-2 border-background-200 pb-1 mb-1"
        onPress={() => setCardPreviewModalOpen(true)}
      >
        <Text size="lg" weight="bold">
          {titleCase(title)}
        </Text>

        <View className="flex flex-row gap-2">
          {!commander && <Text>{count}</Text>}

          {showPrice && (
            <Text className="w-14 text-right">{currency(price)}</Text>
          )}
        </View>
      </Pressable>

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
                  <Text weight="semi">{titleCase(group.title)}</Text>

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
                    format={format}
                    viewType={viewType}
                    showPrice={showPrice}
                    hideCount={hideCount}
                    commander={commander}
                    showManaValue={showManaValue}
                    colorIdentity={colorIdentity}
                    last={index === cardGroupings.length - 1}
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
  const [open, setOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const [banned, setBanned] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [reasons, setReasons] = useState([] as string[]);

  const cardCount = Array(card.count).fill(undefined);

  useEffect(() => {
    if (!format || format === MTGFormats.CUBE) return;

    const { legal, restricted, reasons } = evaluateCardLegality(
      card,
      format,
      colorIdentity
    );

    if (!legal) {
      setBanned(true);
    } else if (restricted) {
      setRestricted(true);
    }

    if (reasons.length) {
      setReasons(reasons);
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
                weight="medium"
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
            fullHeight
            onLinkPress={() => setOpen(false)}
            card={card}
          >
            {reasons?.length > 0 && (
              <View className="flex">
                <Text size="sm" weight="semi" className="mb-1">
                  Legality Issues
                </Text>
                {reasons.map((reason, index) => (
                  <View
                    key={index}
                    className="flex flex-row items-center gap-2 ml-1"
                  >
                    <View className="w-1 h-1 rounded-full bg-white" />
                    <CardText size="sm" text={reason} />
                  </View>
                ))}
              </View>
            )}
          </CardDetailedPreview>
        </Modal>
      </View>
    </>
  );
}
