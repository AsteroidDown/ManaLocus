import { MTGCardType, MTGCardTypes } from "@/constants/mtg/mtg-types";
import { Card } from "@/models/card/card";

export function getCardManaCost(card: Card) {
  if (card.manaCost) return card.manaCost;

  const frontCost = card.faces?.front.manaCost;
  const backCost = card.faces?.back.manaCost;

  if (frontCost && backCost) return `${frontCost} // ${backCost}`;
  else if (frontCost) return frontCost;
  else if (backCost) return backCost;
  else return "";
}

export function getCardType(card: Card): MTGCardType {
  const cardTypeFromTypeLine = (card.typeLine ?? card.faces?.front.typeLine)
    .split("—")[0]
    .toLowerCase();

  if (cardTypeFromTypeLine.includes(MTGCardTypes.CREATURE)) {
    return MTGCardTypes.CREATURE;
  }

  for (const cardType in MTGCardTypes) {
    if (cardTypeFromTypeLine.includes(cardType.toLowerCase()))
      return cardType.toLowerCase() as MTGCardType;
  }

  return MTGCardTypes.CREATURE;
}
