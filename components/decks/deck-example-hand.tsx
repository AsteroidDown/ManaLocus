import {
  sortCardsAlphabetically,
  sortCardsByManaValue,
} from "@/functions/cards/card-sorting";
import { Card } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";
import { faList, faShop } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import { Linking, useWindowDimensions, View } from "react-native";
import CardDetailedPreview from "../cards/card-detailed-preview";
import CardImage from "../cards/card-image";
import Button from "../ui/button/button";
import Modal from "../ui/modal/modal";
import Text from "../ui/text/text";

export interface DeckTestHandProps {
  deck: Deck;
}

export default function DeckExampleHand({ deck }: DeckTestHandProps) {
  const [maxWidth, setMaxWidth] = React.useState(0);

  const width = useWindowDimensions().width;

  const [cards, setCards] = React.useState([] as Card[]);
  let [deckCards, setDeckCards] = React.useState([] as Card[]);
  let [handCards, setHandCards] = React.useState([] as Card[]);

  useEffect(() => {
    if (!deck) return;

    const mainCards = deck.main.reduce((acc, card) => {
      if (
        (deck.commander && card.scryfallId === deck.commander.scryfallId) ||
        (deck.partner && card.scryfallId === deck.partner.scryfallId)
      ) {
        return acc;
      }

      for (let i = 0; i < card.count; i++) acc.push(card);
      return acc;
    }, [] as Card[]);

    setCards(mainCards);
    setDeckCards(mainCards);
  }, [deck]);

  useEffect(() => {
    if (!cards?.length) return;

    drawHand();
  }, [cards]);

  function drawHand() {
    deckCards = [...cards];
    handCards = [];

    for (let i = 0; i < 7; i++) {
      const randomNumber = Math.floor(Math.random() * deckCards.length);

      handCards.push(deckCards[randomNumber]);
      deckCards.splice(randomNumber, 1);
    }

    setHandCards(sortCardsByManaValue(sortCardsAlphabetically(handCards)));
    setDeckCards(deckCards);
  }

  function drawCard() {
    const randomNumber = Math.floor(Math.random() * deckCards.length);

    setDeckCards(deckCards);
    setHandCards([...handCards, deckCards[randomNumber]]);

    deckCards.splice(randomNumber, 1);
  }

  return (
    <View
      className="flex gap-2"
      onLayout={(event) =>
        setMaxWidth((event.nativeEvent.layout.width || 0) - 224)
      }
    >
      <View className="flex lg:flex-row justify-between lg:items-center gap-4">
        <Text size="lg" weight="bold">
          Example Hand
        </Text>

        {width > 600 && (
          <View className="flex flex-row gap-2">
            <Button
              size="sm"
              text="New Hand"
              type="outlined"
              onClick={drawHand}
            />
            <Button
              size="sm"
              text="Draw Card"
              type="outlined"
              onClick={drawCard}
              disabled={!deckCards.length}
            />
          </View>
        )}
      </View>

      <View className="flex flex-row justify-center">
        <View style={{ maxWidth }} className="flex lg:flex-row w-full">
          {handCards.map((card, index) => (
            <HandCard
              key={index}
              card={card}
              full={index === handCards.length - 1}
            />
          ))}
        </View>
      </View>

      {width <= 600 && (
        <View className="flex flex-row gap-4">
          <Button
            text="New Hand"
            type="outlined"
            className="lg:flex-0 flex-1"
            onClick={drawHand}
          />
          <Button
            text="Draw Card"
            type="outlined"
            className="lg:flex-0 flex-1"
            onClick={drawCard}
            disabled={!deckCards.length}
          />
        </View>
      )}
    </View>
  );
}

export function HandCard({ card, full }: { card: Card; full: boolean }) {
  const [open, setOpen] = React.useState(false);

  if (!card) return null;

  return (
    <View
      className={`flex-1 flex lg:flex-row lg:justify-center items-center hover:z-10 z-0 ${
        full ? "h-fit" : "lg:max-h-fit max-h-10"
      }`}
    >
      <CardImage enlargeOnHover card={card} onClick={() => setOpen(true)} />

      <View className="-mt-0.5">
        <Modal open={open} setOpen={setOpen}>
          <CardDetailedPreview
            link
            onLinkPress={() => setOpen(false)}
            card={card}
            className="!p-0"
          >
            <View className="flex flex-row gap-2">
              <Button
                size="sm"
                action="info"
                className="flex-1"
                icon={faShop}
                text={`$${card.prices?.usd}`}
                onClick={async () =>
                  card.priceUris?.tcgplayer &&
                  (await Linking.openURL(card.priceUris.tcgplayer))
                }
              />

              <Button
                size="sm"
                action="info"
                className="flex-1"
                icon={faShop}
                text={`€${card.prices?.eur}`}
                onClick={async () =>
                  card.priceUris?.cardmarket &&
                  (await Linking.openURL(card.priceUris.cardmarket))
                }
              />
            </View>

            <Button
              text="More Details"
              className="flex-1 w-full"
              icon={faList}
            />
          </CardDetailedPreview>
        </Modal>
      </View>
    </View>
  );
}
