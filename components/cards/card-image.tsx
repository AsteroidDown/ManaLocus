import Text from "@/components/ui/text/text";
import { CardBackIds } from "@/constants/scryfall/ids";
import { isOnScreen } from "@/hooks/on-screen";
import { Card } from "@/models/card/card";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image, Pressable, View, ViewProps } from "react-native";
import Skeleton from "../ui/skeleton/skeleton";

export interface CardImageProps extends ViewProps {
  card?: Card;
  focusable?: boolean;
  placeHolder?: string;

  shouldLoad?: boolean;
  enlargeOnHover?: boolean;

  onClick?: () => any;
  onLoad?: () => any;
}

export default function CardImage({
  card,
  focusable,
  placeHolder,
  shouldLoad,
  enlargeOnHover,
  className,
  onClick,
  onLoad,
}: CardImageProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [showFront, setShowFront] = useState(true);

  const [frontLoading, setFrontLoading] = useState(false);
  const [frontLoaded, setFrontLoaded] = useState(false);
  const [backLoading, setBackLoading] = useState(false);
  const [backLoaded, setBackLoaded] = useState(false);

  const ref = useRef<View>(null);
  const onScreen = isOnScreen(ref);

  const containerClasses = `${className} min-w-[228px] max-h-fit border-2 border-primary-200 border-opacity-0 focus:border-opacity-100 rounded-xl overflow-hidden outline-none transition-all duration-300`;

  const baseClasses =
    "flex h-full max-h-[350px] aspect-[2.5/3.5] rounded-lg overflow-hidden";

  const imagePlaceHolder = (
    <Skeleton className="h-full max-h-[350px] aspect-[2.5/3.5] !rounded-xl" />
  );

  const cardImage = useMemo(() => {
    if (frontLoaded) {
      return (
        <Image
          source={{ uri: card?.imageURIs?.png }}
          style={[{ resizeMode: "contain" }]}
          className={`max-h-[350px] aspect-[2.5/3.5] rounded-xl h-full`}
        />
      );
    }

    if (!onScreen && !shouldLoad) return;

    return (
      <Image
        source={{ uri: card?.imageURIs?.png }}
        style={[{ resizeMode: "contain" }]}
        className={`max-h-[350px] aspect-[2.5/3.5] rounded-xl ${
          frontLoading ? "!h-0" : "h-full"
        }`}
        onLoad={() => {
          setFrontLoading(false);
          setFrontLoaded(true);
          onLoad?.();
        }}
        onLoadEnd={() => {
          setFrontLoading(false);
          setFrontLoaded(true);
          onLoad?.();
        }}
        onLoadStart={() => {
          setFrontLoading(true);
          setFrontLoaded(false);
        }}
      />
    );
  }, [card?.imageURIs?.png, onScreen, frontLoaded, shouldLoad]);

  const cardFrontImage = useMemo(() => {
    if (frontLoaded) {
      return (
        <Image
          source={{ uri: card?.faces?.front.imageUris?.png }}
          style={[{ resizeMode: "contain" }]}
          className={`max-h-[350px] aspect-[2.5/3.5] rounded-xl h-full`}
        />
      );
    }

    if (!onScreen && !shouldLoad) return;

    return (
      <Image
        source={{ uri: card?.faces?.front.imageUris?.png }}
        style={[{ resizeMode: "contain" }]}
        className={`max-h-[350px] aspect-[2.5/3.5] rounded-xl ${
          frontLoading ? "!h-0" : "h-full"
        }`}
        onLoad={() => {
          setFrontLoading(false);
          setFrontLoaded(true);
          onLoad?.();
        }}
        onLoadEnd={() => {
          setFrontLoading(false);
          setFrontLoaded(true);
          onLoad?.();
        }}
        onLoadStart={() => {
          setFrontLoading(true);
          setFrontLoaded(false);
        }}
      />
    );
  }, [card?.faces?.front.imageUris?.png, onScreen, frontLoaded, shouldLoad]);

  const cardBackImage = useMemo(() => {
    if (backLoaded) {
      return (
        <Image
          source={{ uri: card?.faces?.back?.imageUris?.png }}
          style={[{ resizeMode: "contain" }]}
          className={`max-h-[350px] aspect-[2.5/3.5] rounded-xl h-full`}
        />
      );
    }

    if (!onScreen && !shouldLoad) return;

    return (
      <Image
        source={{ uri: card?.faces?.back?.imageUris?.png }}
        style={[{ resizeMode: "contain" }]}
        className={`max-h-[350px] aspect-[2.5/3.5] rounded-xl ${
          backLoading ? "!h-0" : "h-full"
        }`}
        onLoad={() => {
          setBackLoading(false);
          setBackLoaded(true);
          onLoad?.();
        }}
        onLoadEnd={() => {
          setBackLoading(false);
          setBackLoaded(true);
          onLoad?.();
        }}
        onLoadStart={() => {
          setBackLoading(true);
          setBackLoaded(false);
        }}
      />
    );
  }, [card?.faces?.back?.imageUris?.png, onScreen, backLoaded, shouldLoad]);

  useEffect(() => setShowFront(true), [card]);

  if (focusable === undefined) {
    onClick ? (focusable = true) : (focusable = false);
  }

  return (
    <Pressable
      className={`${enlargeOnHover ? "hover:!-m-4" : ""} ${containerClasses}`}
      disabled={!card || !onClick}
      tabIndex={!card ? -1 : focusable ? 0 : -1}
      onPress={() => (focusable ? onClick?.() : null)}
      onBlur={() => (focusable ? setFocused(false) : null)}
      onFocus={() => (focusable ? setFocused(true) : null)}
    >
      <View ref={ref} className={baseClasses}>
        {card && !card.faces?.back?.imageUris?.png && (
          <>
            {frontLoading && imagePlaceHolder}
            {cardImage}
          </>
        )}

        {card && card.faces?.back?.imageUris?.png && (
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
          onPress={(event) => {
            setShowFront(!showFront);
            event.stopPropagation();
          }}
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
