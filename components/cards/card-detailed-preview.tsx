import { Card } from "@/models/card/card";
import React from "react";
import { View, ViewProps } from "react-native";
import Divider from "../ui/divider/divider";
import CardImage from "./card-image";
import { CardInfo } from "./card-info";
import { CardLegalities } from "./card-legalities";

export type CardDetailedPreview = ViewProps & {
  card?: Card;

  link?: boolean;
  onLinkPress?: () => any;
  fullHeight?: boolean;
  hideLegalities?: boolean;
};

export default function CardDetailedPreview({
  card,
  link = false,
  onLinkPress,
  fullHeight = false,
  hideLegalities = false,
  className,
  children,
}: CardDetailedPreview) {
  if (!card) return null;

  return (
    <View
      className={`flex flex-row flex-wrap flex-1 max-w-max min-w-fit justify-center gap-3 h-fit ${className}`}
    >
      <View className="flex gap-3 min-w-[250px]">
        <CardImage
          card={card}
          placeHolder="Search for a card and it will be previewed here"
        />

        {children}
      </View>

      <View
        className={`flex gap-3 w-[400px] overflow-y-auto ${
          fullHeight ? "h-fit" : "max-h-[458px]"
        }`}
      >
        {!card?.faces && (
          <CardInfo link={link} onLinkPress={onLinkPress} card={card} />
        )}

        {card?.faces && (
          <View className="flex gap-3">
            <CardInfo link={link} card={card} face={card.faces.front} />

            <Divider thick className="my-3" />

            <CardInfo link={link} card={card} face={card.faces.back} />
          </View>
        )}

        {!hideLegalities && <Divider thick />}

        {!hideLegalities && (
          <View className="mb-0">
            <CardLegalities card={card} />
          </View>
        )}
      </View>
    </View>
  );
}
