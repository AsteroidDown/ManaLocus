import { BoardType } from "@/constants/boards";
import { Card } from "@/models/card/card";
import { DeckCard } from "@/models/deck/deck";

export function mapCardsToDeckCard(
  cards: Card[],
  board: BoardType
): DeckCard[] {
  return cards.map((card) => ({
    scryfallId: card.scryfallId,
    name: card.name,
    count: card.count,
    group: card.group,
    board,
  }));
}
