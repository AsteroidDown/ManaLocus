import { MTGRarities } from "@/constants/mtg/mtg-rarity";
import { MTGCardTypes } from "@/constants/mtg/mtg-types";
import { DeckCard } from "@/models/deck/deck";

export type DeckCardGalleryGroupType = "cardType" | "rarity";

export enum DeckCardGalleryGroupTypes {
  TYPE = "cardType",
  RARITY = "rarity",
}

export function getCardGroupOrder(
  groupedCards: { [key: string]: DeckCard[] },
  groupType: DeckCardGalleryGroupType
) {
  if (groupType === DeckCardGalleryGroupTypes.TYPE) {
    return [
      ...(groupedCards[MTGCardTypes.CREATURE]?.length
        ? [{ title: "Creature", cards: groupedCards[MTGCardTypes.CREATURE] }]
        : []),
      ...(groupedCards[MTGCardTypes.INSTANT]?.length
        ? [{ title: "Instant", cards: groupedCards[MTGCardTypes.INSTANT] }]
        : []),
      ...(groupedCards[MTGCardTypes.SORCERY]?.length
        ? [{ title: "Sorcery", cards: groupedCards[MTGCardTypes.SORCERY] }]
        : []),
      ...(groupedCards[MTGCardTypes.ARTIFACT]?.length
        ? [{ title: "Artifact", cards: groupedCards[MTGCardTypes.ARTIFACT] }]
        : []),
      ...(groupedCards[MTGCardTypes.ENCHANTMENT]?.length
        ? [
            {
              title: "Enchantment",
              cards: groupedCards[MTGCardTypes.ENCHANTMENT],
            },
          ]
        : []),
      ...(groupedCards[MTGCardTypes.PLANESWALKER]?.length
        ? [
            {
              title: "Planeswalker",
              cards: groupedCards[MTGCardTypes.PLANESWALKER],
            },
          ]
        : []),
      ...(groupedCards[MTGCardTypes.BATTLE]?.length
        ? [{ title: "Battle", cards: groupedCards[MTGCardTypes.BATTLE] }]
        : []),
      ...(groupedCards[MTGCardTypes.LAND]?.length
        ? [{ title: "Land", cards: groupedCards[MTGCardTypes.LAND] }]
        : []),
    ];
  } else if (groupType === DeckCardGalleryGroupTypes.RARITY) {
    return [
      ...(groupedCards[MTGRarities.COMMON]?.length
        ? [{ title: "Common", cards: groupedCards[MTGRarities.COMMON] }]
        : []),
      ...(groupedCards[MTGRarities.UNCOMMON]?.length
        ? [{ title: "Uncommon", cards: groupedCards[MTGRarities.UNCOMMON] }]
        : []),
      ...(groupedCards[MTGRarities.RARE]?.length
        ? [{ title: "Rare", cards: groupedCards[MTGRarities.RARE] }]
        : []),
      ...(groupedCards[MTGRarities.MYTHIC]?.length
        ? [{ title: "Mythic", cards: groupedCards[MTGRarities.MYTHIC] }]
        : []),
    ];
  }

  return [];
}
