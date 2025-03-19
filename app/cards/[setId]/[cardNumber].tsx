import CardAllPartsList from "@/components/cards/card-all-parts";
import CardDetailedPreview from "@/components/cards/card-detailed-preview";
import CardPrintsList from "@/components/cards/card-prints-list";
import CardRulings from "@/components/cards/card-rulings";
import DecksWithCard from "@/components/decks/decks-with-card";
import Button from "@/components/ui/button/button";
import Divider from "@/components/ui/divider/divider";
import Text from "@/components/ui/text/text";
import BodyHeightContext from "@/contexts/ui/body-height.context";
import { currency, titleCase } from "@/functions/text-manipulation";
import ScryfallService from "@/hooks/services/scryfall.service";
import { Card } from "@/models/card/card";
import { Set } from "@/models/card/set";
import {
  faFileLines,
  faImage,
  faNewspaper,
  faShare,
  faShop,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Image, Linking, SafeAreaView, View } from "react-native";

export default function SetPage() {
  const { setId, cardNumber } = useLocalSearchParams();
  const { setBodyHeight } = useContext(BodyHeightContext);

  const containerRef = useRef<SafeAreaView>(null);

  const [card, setCard] = useState(null as Card | null);
  const [set, setSet] = useState(null as Set | null);

  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    if (typeof setId !== "string" || typeof cardNumber !== "string") return;

    ScryfallService.getSetByCode(setId).then((set) => setSet(set));
    ScryfallService.getCardByNumber(setId, cardNumber).then((card) =>
      setCard(card)
    );
  }, [cardNumber]);

  function copyCardText() {
    if (!card) return;

    let text = "";

    if (!card.faces) {
      text += card.name + " " + card?.manaCost + "\n";
      text += card.typeLine + "\n";
      text += card.oracleText + "\n";
      if (card.power) text += card.power + "/" + card.toughness + "\n";
      if (card.loyalty) text += card.loyalty + "\n";
      if (card.defense) text += card.defense + "\n";
    } else {
      text += card.faces.front.name + " " + card?.faces.front.manaCost + "\n";
      text += card.faces.front.typeLine + "\n";
      text += card.faces.front.oracleText + "\n";
      if (card.power)
        text +=
          card.faces.front.power + "/" + card.faces.front.toughness + "\n";
      if (card.loyalty) text += card.faces.front.loyalty + "\n";
      if (card.defense) text += card.faces.front.defense + "\n";

      text += "\n---\n";

      text += card.faces?.back?.name + " " + card?.faces?.back?.manaCost + "\n";
      text += card.faces?.back?.typeLine + "\n";
      text += card.faces?.back?.oracleText + "\n";
      if (card.power)
        text += card.faces.back.power + "/" + card.faces.back.toughness + "\n";
      if (card.loyalty) text += card.faces.back.loyalty + "\n";
      if (card.defense) text += card.faces.back.defense + "\n";
    }

    navigator.clipboard.writeText(text);

    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  }

  if (!card) return;

  return (
    <SafeAreaView
      ref={containerRef}
      onLayout={() =>
        containerRef.current?.measureInWindow((_x, _y, _width, height) =>
          setBodyHeight(height)
        )
      }
    >
      <View className="flex flex-1 gap-4 lg:px-16 px-8 py-4 min-h-[100dvh] bg-background-100">
        <View className="flex flex-row flex-wrap justify-center gap-8 max-w-full pt-6">
          <CardDetailedPreview
            fullHeight
            hidePrices
            card={card}
            className="flex-[2] max-h-fit lg:min-w-max min-w-fit !bg-transparent !p-0"
          />

          <View className="lg:flex-[0] flex-1 flex gap-2 lg:min-w-max">
            <Link
              href={`cards/${set?.code}`}
              className="flex flex-row items-center gap-4 px-4 pt-1 pb-2 lg:max-w-[350px] border-2 border-primary-200 border-opacity-30 rounded-md"
            >
              <Image
                source={{ uri: set?.iconSvgUri }}
                style={[{ resizeMode: "contain" }]}
                className="h-8 w-8 fill-white invert-[1]"
              />

              <View className="flex-1">
                <Text size="lg" weight="semi">
                  {set?.name}
                </Text>
                <Text>
                  {set?.code.toUpperCase()} | #{card.collectorNumber} |{" "}
                  {titleCase(card.rarity)}
                </Text>
              </View>
            </Link>

            {card.allParts && <CardAllPartsList parts={card.allParts} />}

            <CardPrintsList card={card} />
          </View>
        </View>

        <View className="flex flex-row gap-6 flex-wrap lg:mt-12 mt-2 lg:mb-6 mb-2">
          <View className="flex-1 flex gap-2 min-w-max">
            <Text size="lg" weight="semi">
              From the Web
            </Text>

            <Divider thick className="!border-background-300" />

            {card.relatedUris.edhrec && (
              <Button
                icon={faShare}
                size="sm"
                type="outlined"
                action="success"
                text="View on EDHREC"
                onClick={() => Linking.openURL(card.relatedUris.edhrec)}
              />
            )}

            {card.relatedUris.gatherer && (
              <Button
                icon={faShare}
                size="sm"
                action="success"
                type="outlined"
                text="View on Gatherer"
                onClick={() => Linking.openURL(card.relatedUris.gatherer)}
              />
            )}

            {card.relatedUris.tcgplayerInfiniteArticles && (
              <Button
                icon={faNewspaper}
                size="sm"
                action="success"
                type="outlined"
                text="TCGPlayer Infinite Articles"
                onClick={() =>
                  Linking.openURL(card.relatedUris.tcgplayerInfiniteArticles)
                }
              />
            )}

            {card.relatedUris.tcgplayerInfiniteDecks && (
              <Button
                icon={faTable}
                size="sm"
                type="outlined"
                action="success"
                text="TCGPlayer Infinite Decks"
                onClick={() =>
                  Linking.openURL(card.relatedUris.tcgplayerInfiniteDecks)
                }
              />
            )}
          </View>

          <View className="flex-1 flex gap-2 min-w-max">
            <Text size="lg" weight="semi">
              Buy Card
            </Text>

            <Divider thick className="!border-background-300" />

            {card.priceUris.tcgplayer && (
              <Button
                icon={faShop}
                size="sm"
                action="info"
                type="outlined"
                text={`TCG Player  ${currency(card.prices?.usd)}`}
                onClick={() => Linking.openURL(card.priceUris.tcgplayer || "")}
              />
            )}

            {card.priceUris.cardmarket && (
              <Button
                icon={faShop}
                size="sm"
                action="info"
                type="outlined"
                text={`Card Market  ${currency(card.prices?.eur, true)}`}
                onClick={() => Linking.openURL(card.priceUris.cardmarket || "")}
              />
            )}

            {card.priceUris.cardhoarder && (
              <Button
                icon={faShop}
                size="sm"
                action="info"
                type="outlined"
                text={`Card Hoarder  ${currency(card.prices?.eur)}`}
                onClick={() =>
                  Linking.openURL(card.priceUris.cardhoarder || "")
                }
              />
            )}
          </View>

          <View className="flex-1 flex gap-2 min-w-max">
            <Text size="lg" weight="semi">
              Card Data
            </Text>

            <Divider thick className="!border-background-300" />

            {card.imageURIs?.png && (
              <Button
                size="sm"
                action="warning"
                type="outlined"
                text="Download PNG"
                icon={faImage}
                onClick={() => Linking.openURL(card.imageURIs?.png || "")}
              />
            )}

            {card.faces?.front.imageUris.png && (
              <Button
                size="sm"
                action="warning"
                type="outlined"
                text="Download Front PNG"
                icon={faImage}
                onClick={() =>
                  Linking.openURL(card.faces?.front.imageUris.png || "")
                }
              />
            )}

            {card.faces?.back.imageUris.png && (
              <Button
                size="sm"
                action="warning"
                type="outlined"
                text="Download Back PNG"
                icon={faImage}
                onClick={() =>
                  Linking.openURL(card.faces?.back.imageUris.png || "")
                }
              />
            )}

            {card.imageURIs?.artCrop && (
              <Button
                size="sm"
                action="warning"
                type="outlined"
                text="Download Art Crop"
                icon={faImage}
                onClick={() => Linking.openURL(card.imageURIs?.artCrop || "")}
              />
            )}

            {card.faces?.front.imageUris.artCrop && (
              <Button
                size="sm"
                action="warning"
                type="outlined"
                text="Download Front Art Crop"
                icon={faImage}
                onClick={() =>
                  Linking.openURL(card.faces?.front.imageUris.artCrop || "")
                }
              />
            )}

            {card.faces?.back.imageUris.artCrop && (
              <Button
                size="sm"
                action="warning"
                type="outlined"
                text="Download Back Art Crop"
                icon={faImage}
                onClick={() =>
                  Linking.openURL(card.faces?.back.imageUris.artCrop || "")
                }
              />
            )}

            <Button
              size="sm"
              type="outlined"
              action={copiedText ? "success" : "warning"}
              text={copiedText ? "Copied!" : "Copy Card Text"}
              icon={faFileLines}
              onClick={copyCardText}
            />
          </View>
        </View>

        <CardRulings card={card} />

        <DecksWithCard card={card} />
      </View>
    </SafeAreaView>
  );
}
