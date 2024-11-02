import CardDetailedPreview from "@/components/cards/card-detailed-preview";
import ScryfallService from "@/hooks/scryfall.service";
import { Card } from "@/models/card/card";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";

export default function SetPage() {
  const { setId, cardNumber } = useLocalSearchParams();

  const [card, setCard] = React.useState(null as Card | null);

  useEffect(() => {
    if (typeof setId !== "string" || typeof cardNumber !== "string") return;

    ScryfallService.getCardByNumber(setId, Number(cardNumber)).then((card) =>
      setCard(card)
    );
  }, [cardNumber]);

  return (
    <ScrollView>
      <View className="flex items-center bg-background-100 min-h-[100vh] pt-6">
        {card && (
          <CardDetailedPreview
            fullHeight
            card={card}
            className="max-h-fit !bg-transparent"
          />
        )}
      </View>
    </ScrollView>
  );
}
