import { Card } from "@/models/card/card";
import { DeckCard } from "@/models/deck/deck";
import { getCardManaCost, getCardType } from "../card-information";

export function mapCardToDeckCard(card: Card): DeckCard {
  return {
    scryfallId: card.id,
    name: card.name,
    setId: card.set,
    collectorNumber: card.collectorNumber,
    count: card.count,
    manaCost: getCardManaCost(card),
    cardType: getCardType(card),
    rarity: card.rarity,
    frontImageUrl: card.images?.png ?? card.faces?.front.imageUris?.png,
    backImageUrl: card.images?.png ?? card.faces?.back.imageUris?.png,
    price: card.prices?.usd || 0,
    tcgPlayerUrl: card.priceUris?.tcgplayer,
    cardMarketUrl: card.priceUris?.cardmarket,
  };
}
