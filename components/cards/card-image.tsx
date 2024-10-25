import Text from "@/components/ui/text/text";
import { CardBackIds } from "@/constants/scryfall/ids";
import { Card } from "@/models/card/card";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo } from "react";
import { Image, Pressable, View } from "react-native";

export interface CardImageProps {
  card?: Card;
  focusable?: boolean;
  placeHolder?: string;

  onClick?: () => any;
}

export default function CardImage({
  card,
  focusable,
  placeHolder,
  onClick,
}: CardImageProps) {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [showFront, setShowFront] = React.useState(true);

  const [frontLoading, setFrontLoading] = React.useState(false);
  const [backLoading, setBackLoading] = React.useState(false);

  const containerClasses =
    "min-w-[228px] max-h-fit border-2 border-primary-200 border-opacity-0 focus:border-opacity-100 rounded-xl overflow-hidden outline-none transition-all duration-300";

  const baseClasses =
    "flex h-full max-h-[350px] aspect-[2.5/3.5] rounded-lg overflow-hidden";

  const imagePlaceHolder = (
    <View className="h-full max-h-[350px] aspect-[2.5/3.5] rounded-xl transition-all bg-background-100 animate-pulse"></View>
  );

  const cardImage = useMemo(
    () => (
      <Image
        source={{ uri: card?.images?.png }}
        style={[{ resizeMode: "contain" }]}
        className={`max-h-[350px] aspect-[2.5/3.5] rounded-xl ${
          frontLoading ? "!h-0" : "h-full"
        }`}
        onLoad={() => setFrontLoading(false)}
        onLoadEnd={() => setFrontLoading(false)}
        onLoadStart={() => setFrontLoading(true)}
      />
    ),
    [card?.images?.png]
  );

  const cardFrontImage = useMemo(
    () => (
      <Image
        source={{ uri: card?.faces?.front.imageUris?.png }}
        style={[{ resizeMode: "contain" }]}
        className={`max-h-[350px] aspect-[2.5/3.5] rounded-xl ${
          frontLoading ? "!h-0" : "h-full"
        }`}
        onLoad={() => setFrontLoading(false)}
        onLoadEnd={() => setFrontLoading(false)}
        onLoadStart={() => setFrontLoading(true)}
      />
    ),
    [card?.faces?.front.imageUris?.png]
  );

  const cardBackImage = useMemo(
    () => (
      <Image
        source={{ uri: card?.faces?.back.imageUris?.png }}
        style={[{ resizeMode: "contain" }]}
        className={`max-h-[350px] aspect-[2.5/3.5] rounded-xl ${
          frontLoading ? "!h-0" : "h-full"
        }`}
        onLoad={() => setBackLoading(false)}
        onLoadEnd={() => setBackLoading(false)}
        onLoadStart={() => setBackLoading(true)}
      />
    ),
    [card?.faces?.back.imageUris?.png]
  );

  useEffect(() => setShowFront(true), [card]);

  if (focusable === undefined) {
    onClick ? (focusable = true) : (focusable = false);
  }

  return (
    <Pressable
      className={containerClasses}
      disabled={!card || !onClick}
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      tabIndex={!card ? -1 : focusable ? 0 : -1}
      onPress={() => (focusable ? onClick?.() : null)}
    >
      <View className={baseClasses}>
        {card && !card.faces?.back.imageUris.png && (
          <>
            {frontLoading && imagePlaceHolder}
            {cardImage}
          </>
        )}

        {card && card.faces?.back.imageUris.png && (
          <View className="bg-transparent w-full h-full">
            <View
              className="relative w-full h-full transition-all duration-700"
              style={!showFront ? { transform: [{ rotateY: "180deg" }] } : {}}
            >
              <View
                className="absolute w-full h-full"
                style={{ backfaceVisibility: "hidden" }}
              >
                <>
                  {frontLoading && imagePlaceHolder}
                  {cardFrontImage}
                </>
              </View>

              <View
                className="absolute w-full h-full transition-all duration-[625ms]"
                style={
                  showFront
                    ? [
                        { transform: [{ rotateY: "180deg" }, { scaleX: -1 }] },
                        { backfaceVisibility: "hidden" },
                      ]
                    : [
                        { transform: [{ rotateY: "0deg" }, { scaleX: -1 }] },
                        { backfaceVisibility: "hidden" },
                      ]
                }
              >
                <>
                  {backLoading && imagePlaceHolder}
                  {cardBackImage}
                </>
              </View>
            </View>
          </View>
        )}

        {!card && (
          <View className="flex justify-center items-center w-full h-full bg-background-100">
            {placeHolder && (
              <Text size="sm" className="text-center">
                {placeHolder}
              </Text>
            )}
          </View>
        )}
      </View>

      {card?.faces && card.cardBackId !== CardBackIds.DEFAULT && (
        <Pressable
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          className="absolute bottom-2 left-2"
          onPress={() => setShowFront(!showFront)}
        >
          <View
            className={
              "bg-background-300 p-2 rounded-full transition-all duration-300 " +
              (hovered ? "bg-opacity-100" : "bg-opacity-75")
            }
          >
            <FontAwesomeIcon
              className={
                "text-white transition-all " +
                (!showFront ? "rotate-[270deg]" : "")
              }
              icon={faRotateRight}
            />
          </View>
        </Pressable>
      )}
    </Pressable>
  );
}
