import { MTGColorSymbol } from "@/constants/mtg/mtg-colors";
import {
  FormatsWithCommander,
  MTGFormat,
  MTGFormatRestrictionsMap,
  MTGFormats,
} from "@/constants/mtg/mtg-format";
import {
  LegalityEvaluation,
  MTGBasicLands,
  MTGLegalities,
} from "@/constants/mtg/mtg-legality";
import { MTGRarities } from "@/constants/mtg/mtg-rarity";
import { Card } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";
import { titleCase } from "../text-manipulation";

export function evaluateDeckLegality(deck: Deck): LegalityEvaluation {
  if (!deck.format) return { legal: false };
  if (deck.format === MTGFormats.CUBE) return { legal: true };

  const restrictions = MTGFormatRestrictionsMap.get(deck.format);

  const legality: LegalityEvaluation = {
    legal: true,
  };

  legality.cards =
    deck.main.every((card) => {
      if (deck.format === MTGFormats.CUBE) return;

      return card.legalities[deck.format] === MTGLegalities.LEGAL;
    }) &&
    deck.side.every((card) => {
      if (deck.format === MTGFormats.CUBE) return;

      return card.legalities[deck.format] === MTGLegalities.LEGAL;
    });

  const deckMainSize = deck.main.reduce((acc, card) => acc + card.count, 0);

  legality.size =
    restrictions?.deckMinSize && restrictions?.deckMaxSize
      ? deckMainSize === restrictions.deckMinSize
      : restrictions?.deckMinSize
      ? deckMainSize >= restrictions.deckMinSize
      : true;

  legality.unique = deck.main.every((card) => {
    if (MTGBasicLands.includes(card.name)) return true;
    else if (
      card.oracleText?.includes("A deck can have") &&
      card.oracleText?.includes("cards named")
    ) {
      if (card.oracleText?.includes("up to")) {
        if (card.oracleText?.includes("seven") && card.count <= 7) {
          return true;
        } else if (card.oracleText?.includes("nine") && card.count <= 9) {
          return true;
        }
      } else if (card.oracleText?.includes("any number of")) return true;
    } else {
      return restrictions?.uniqueCardCount
        ? card.count <= restrictions.uniqueCardCount
        : true;
    }
  });

  if (FormatsWithCommander.includes(deck.format as any)) {
    legality.commander =
      deck.commander &&
      FormatsWithCommander.includes(deck.format as any) &&
      deck.commander.legalities[deck.format] === MTGLegalities.LEGAL;

    legality.colorIdentity = deck.main.every((card) =>
      card.colorIdentity.every((color) =>
        deck.commander?.colorIdentity.includes(color)
      )
    );
  }

  if (restrictions?.maxRarity) {
    legality.rarity = deck.main.every((card) => {
      if (restrictions.maxRarity === MTGRarities.COMMON) {
        return card.rarity === MTGRarities.COMMON;
      } else if (restrictions.maxRarity === MTGRarities.UNCOMMON) {
        return [MTGRarities.COMMON, MTGRarities.UNCOMMON].includes(
          card.rarity as any
        );
      } else if (restrictions.maxRarity === MTGRarities.RARE) {
        return [
          MTGRarities.COMMON,
          MTGRarities.UNCOMMON,
          MTGRarities.RARE,
        ].includes(card.rarity as any);
      } else return true;
    });
  }

  if (restrictions?.maxTix) {
    legality.tix = deck.main.every(
      (card) => card.prices?.tix || 0 <= (restrictions?.maxTix || 0)
    );
  }

  legality.legal = Object.values(legality).every((value) => !!value);

  return legality;
}

export function evaluateCardLegality(
  card: Card,
  format?: MTGFormat,
  colorIdentity?: MTGColorSymbol[]
) {
  let legal = true;
  let restricted = false;
  let reasons: string[] = [];

  if (!format || format === MTGFormats.CUBE)
    return { legal, restricted, reasons };

  const restrictions = MTGFormatRestrictionsMap.get(format);

  if (
    colorIdentity &&
    !card.colorIdentity.every((color) => colorIdentity.includes(color))
  ) {
    legal = false;
    reasons.push(
      `Not in color identity ${
        "{" + (colorIdentity?.length ? colorIdentity : ["C"]).join("}{") + "}"
      }`
    );
  }

  if (
    card.count > (MTGFormatRestrictionsMap.get(format)?.uniqueCardCount || 1) &&
    (!MTGBasicLands.includes(card.name) ||
      (card.oracleText?.includes("A deck can have") &&
        card.oracleText?.includes("cards named")))
  ) {
    legal = false;
    reasons.push(
      `Above unique card count of ${restrictions?.uniqueCardCount || 1}`
    );
  }

  if (
    card.legalities[format] === MTGLegalities.BANNED ||
    card.legalities[format] === MTGLegalities.NOT_LEGAL
  ) {
    legal = false;
    reasons.push(`Card not legal in ${titleCase(format)}`);
  } else if (card.legalities[format] === MTGLegalities.RESTRICTED) {
    if (card.count > 1) {
      legal = false;
      reasons.push(`Only 1 copy of restricted card allowed`);
    } else {
      restricted = true;
    }
  }

  return { legal, restricted, reasons };
}
