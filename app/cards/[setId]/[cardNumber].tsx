import CardDetailedPreview from "@/components/cards/card-detailed-preview";
import { CardLegalities } from "@/components/cards/card-legalities";
import CardPrintsList from "@/components/cards/card-prints-list";
import Box from "@/components/ui/box/box";
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
      <View className="flex items-center bg-background-100 min-h-[100vh] pt-6">
        <View className="flex flex-row gap-4">
          <CardDetailedPreview
            fullHeight
            hideLegalities
            card={card}
            className="max-h-fit !bg-transparent !p-0"
          />

          <View className="flex gap-4">
            <Box shade={200}>
              <CardPrintsList card={card} />
            </Box>

            <Box shade={200}>
              <CardLegalities card={card} />
            </Box>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
