import CardAllPartsList from "@/components/cards/card-all-parts";
import CardDetailedPreview from "@/components/cards/card-detailed-preview";
import { CardLinks } from "@/components/cards/card-links";
import CardPrintsList from "@/components/cards/card-prints-list";
import CardRulings from "@/components/cards/card-rulings";
import DecksWithCard from "@/components/decks/decks-with-card";
import Footer from "@/components/ui/navigation/footer";
import Text from "@/components/ui/text/text";
import { titleCase } from "@/functions/text-manipulation";
import ScryfallService from "@/hooks/services/scryfall.service";
import { Card } from "@/models/card/card";
import { Set } from "@/models/card/set";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, View } from "react-native";

export default function SetPage() {
  const { setId, cardNumber } = useLocalSearchParams();

  const [card, setCard] = useState(null as Card | null);
  const [set, setSet] = useState(null as Set | null);

  useEffect(() => {
    if (typeof setId !== "string" || typeof cardNumber !== "string") return;

    ScryfallService.getSetByCode(setId).then((set) => setSet(set));
    ScryfallService.getCardByNumber(setId, cardNumber).then((card) =>
      setCard(card)
    );
  }, [cardNumber]);

  if (!card) return;

  return (
    <SafeAreaView>
      <View className="flex flex-1 gap-4 lg:px-16 px-8 py-4 min-h-[100dvh] bg-background-100">
        <View className="flex flex-row flex-wrap justify-center gap-8 max-w-full pt-6">
          <CardDetailedPreview
            fullHeight
            hidePrices
            card={card}
            className="flex-[2] max-h-fit lg:min-w-max min-w-fit !bg-transparent !p-0"
          />

          <View className="lg:flex-[0] flex-1 flex gap-2 lg:min-w-[350px]">
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

        <CardLinks card={card} />

        <CardRulings card={card} />

        <DecksWithCard card={card} />
      </View>

      <Footer />
    </SafeAreaView>
  );
}
