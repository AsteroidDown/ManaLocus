import CardDetailedPreview from "@/components/cards/card-detailed-preview";
import { CardLegalities } from "@/components/cards/card-legalities";
import CardPrintsList from "@/components/cards/card-prints-list";
import DecksWithCard from "@/components/decks/decks-with-card";
import Box from "@/components/ui/box/box";
import Text from "@/components/ui/text/text";
import ScryfallService from "@/hooks/services/scryfall.service";
import { Card } from "@/models/card/card";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";

export default function SetPage() {
  const { setId, cardNumber } = useLocalSearchParams();

  const [card, setCard] = React.useState(null as Card | null);

  useEffect(() => {
    if (typeof setId !== "string" || typeof cardNumber !== "string") return;

    ScryfallService.getCardByNumber(setId, cardNumber).then((card) =>
      setCard(card)
    );
  }, [cardNumber]);

  if (!card) return;

  return (
    <ScrollView>
      <View className="flex flex-1 gap-4 px-16 py-8 min-h-[100vh] bg-background-100">
        <View className="flex flex-row flex-wrap justify-center gap-4 max-w-full pt-6">
          <CardDetailedPreview
            fullHeight
            hideLegalities
            card={card}
            className="max-h-fit !bg-transparent !p-0"
          />

          <View className="flex gap-4">
            <View className="flex flex-col gap-2">
              <Text size="lg" thickness="bold">
                Prints
              </Text>

              <Box shade={200}>
                <CardPrintsList card={card} />
              </Box>
            </View>

            <View className="flex flex-col gap-2">
              <Text size="lg" thickness="bold">
                Legalities
              </Text>

              <Box shade={200}>
                <CardLegalities card={card} />
              </Box>
            </View>
          </View>
        </View>

        <DecksWithCard card={card} />
      </View>
    </ScrollView>
  );
}
