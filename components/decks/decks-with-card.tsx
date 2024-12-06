import DeckService from "@/hooks/services/deck.service";
import { Card } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";
import { Link } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import Divider from "../ui/divider/divider";
import Text from "../ui/text/text";
import DeckCard from "./deck-card";

export interface DecksWithCardProps {
  card: Card;
}

export default function DecksWithCard({ card }: DecksWithCardProps) {
  const [decks, setDecks] = React.useState([] as Deck[]);

  useEffect(() => {
    if (!card) return;

    DeckService.getMany({ scryfallIds: [card.scryfallId] }).then((decks) =>
      setDecks(decks)
    );
  }, [card]);

  if (!decks?.length) return;

  return (
    <View className="flex gap-4 w-full">
      <Text size="lg" thickness="bold">
        Decks Featuring {card.name}
      </Text>

      <Divider thick className="!border-background-200" />

      <View className="flex flex-row flex-wrap gap-4">
        {decks?.map((deck, index) => (
          <Link key={deck.id + index} href={`../../decks/${deck.id}`}>
            <DeckCard deck={deck} />
          </Link>
        ))}
      </View>
    </View>
  );
}
