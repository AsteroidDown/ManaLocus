import { Card } from "@/models/card/card";
import { DeckCard } from "@/models/deck/deck";

export function mapCardToDeckCard(card: Card): DeckCard {
  return {
    scryfallId: card.id,
    name: card.name,
    count: card.count,
    castingCost: getManaCost(card),
    frontImageUrl: card.images?.png ?? card.faces?.front.imageUris?.png,
    backImageUrl: card.images?.png ?? card.faces?.back.imageUris?.png,
    tcgPlayerUrl: card.priceUris?.tcgplayer,
    cardMarketUrl: card.priceUris?.cardmarket,
  };
}

function getManaCost(card: Card) {
  if (card.manaCost) return card.manaCost;

  const frontCost = card.faces?.front.manaCost;
  const backCost = card.faces?.back.manaCost;

  if (frontCost && backCost) return `${frontCost} // ${backCost}`;
  else if (frontCost) return frontCost;
  else if (backCost) return backCost;
  else return "";
}
