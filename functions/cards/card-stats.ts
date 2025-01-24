import { Card } from "../../models/card/card";

export function getTotalValueOfCards(cards: Card[], euro: boolean = false) {
  return (
    Math.round(
      cards.reduce(
        (acc, card) =>
          acc +
          card.count * (euro ? card.prices.eur || 0 : card.prices.usd || 0),
        0
      ) * 100
    ) / 100
  );
}

export function getCountOfCards(cards: Card[]) {
  return cards?.reduce((acc, card) => acc + card.count, 0) || 0;
}
