import {
  sortCardsAlphabetically,
  sortCardsByManaValue,
} from "@/functions/card-sorting";
import { Card } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";
import React, { useEffect } from "react";
import { View } from "react-native";
import CardImage from "../cards/card-image";
import Button from "../ui/button/button";
import Text from "../ui/text/text";

export interface DeckTestHandProps {
  deck: Deck;
}

export default function DeckExampleHand({ deck }: DeckTestHandProps) {
  const [maxWidth, setMaxWidth] = React.useState(0);

  const [selectedNumbers, setSelectedNumbers] = React.useState([] as number[]);
  const [selectedCards, setSelectedCards] = React.useState([] as Card[]);

  const cards = deck.main.reduce((acc, card) => {
    for (let i = 0; i < card.count; i++) acc.push(card);
    return acc;
  }, [] as Card[]);

  useEffect(() => {
    if (!deck) return;

    drawHand();
  }, [deck]);

  function drawHand() {
    if (cards.length < 7) return;

    const hand = Array(7).fill(-1);

    const handNumbers = hand.map(() => {
      let randomNumber = Math.floor(Math.random() * cards.length);

      while (hand.includes(randomNumber)) {
        randomNumber = Math.floor(Math.random() * cards.length);
      }

      return randomNumber;
    });

    setSelectedNumbers(handNumbers);

    setSelectedCards(
      sortCardsByManaValue(
        sortCardsAlphabetically(
          handNumbers.map((selectedCard) => cards[selectedCard])
        )
      )
    );
  }

  function drawCard() {
    if (!selectedNumbers.length || selectedNumbers.length === cards.length) {
      return;
    }

    let randomNumber = Math.floor(Math.random() * cards.length);

    while (selectedNumbers.includes(randomNumber)) {
      randomNumber = Math.floor(Math.random() * cards.length);
    }

    setSelectedNumbers([...selectedNumbers, randomNumber]);
    setSelectedCards([...selectedCards, cards[randomNumber]]);
  }

  return (
    <View
      className="flex-1 flex gap-2"
      onLayout={(event) =>
        setMaxWidth((event.nativeEvent.layout.width || 0) - 224)
      }
    >
      <View className="flex flex-row justify-between items-center gap-4">
        <Text size="lg" thickness="bold">
          Example Hand
        </Text>

        <View className="flex flex-row gap-2">
          <Button text="New Hand" onClick={drawHand} />
          <Button
            text="Draw Card"
            onClick={drawCard}
            disabled={selectedNumbers.length === cards.length}
          />
        </View>
      </View>

      <View className="flex flex-row justify-center">
        <View style={{ maxWidth }} className="flex flex-row w-full">
          {selectedCards.map((card, index) => (
            <View
              key={index}
              className="flex-1 flex flex-row justify-center hover:z-10 z-0"
            >
              <CardImage card={card} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
