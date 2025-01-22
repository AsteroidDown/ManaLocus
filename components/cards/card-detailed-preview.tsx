import Button from "@/components/ui/button/button";
import { currency } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import { faShop } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Linking, View, ViewProps } from "react-native";
import Divider from "../ui/divider/divider";
import CardImage from "./card-image";
import { CardInfo } from "./card-info";
import { CardLegalities } from "./card-legalities";

export type CardDetailedPreview = ViewProps & {
  card?: Card;

  link?: boolean;
  onLinkPress?: () => any;

  fullHeight?: boolean;
  hidePrices?: boolean;
};

export default function CardDetailedPreview({
  card,
  link = false,
  onLinkPress,
  fullHeight = false,
  hidePrices = false,
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

        {!hidePrices && (
          <View className="flex gap-2">
            <Button
              size="sm"
              action="info"
              type="outlined"
              className="flex-1"
              icon={faShop}
              text={`TCG Player  ${currency(card.prices?.usd)}`}
              onClick={async () =>
                card.priceUris?.tcgplayer &&
                (await Linking.openURL(card.priceUris.tcgplayer))
              }
            />

            <Button
              size="sm"
              action="info"
              type="outlined"
              className="flex-1"
              icon={faShop}
              text={`Card Market  ${currency(card.prices?.eur, true)}`}
              onClick={async () =>
                card.priceUris?.cardmarket &&
                (await Linking.openURL(card.priceUris.cardmarket))
              }
            />
          </View>
        )}

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

            <CardInfo link={link} card={card} face={card.faces.back} />
          </View>
        )}

        <Divider thick className="!border-background-200" />

        <View className="px-1 mb-0">
          <CardLegalities card={card} />
        </View>
      </View>
    </View>
  );
}
