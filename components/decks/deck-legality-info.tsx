import {
  MTGFormat,
  MTGFormatRestrictionsMap,
} from "@/constants/mtg/mtg-format";
import { LegalityEvaluation } from "@/constants/mtg/mtg-legality";
import { MTGRarities } from "@/constants/mtg/mtg-rarity";
import { titleCase } from "@/functions/text-manipulation";
import { View } from "react-native";
import Text from "../ui/text/text";

export interface DeckLegalityProps {
  format: MTGFormat;
  legalityEvaluation: LegalityEvaluation;
}

export default function DeckLegalityInfo({
  format,
  legalityEvaluation,
}: DeckLegalityProps) {
  const restrictions = MTGFormatRestrictionsMap.get(format);

  return (
    <View className="flex">
      <Text>This deck is{legalityEvaluation.legal ? " " : " not "}legal</Text>

      {legalityEvaluation?.commander && (
        <Text>This deck has a legal commander</Text>
      )}

      <Text>
        {legalityEvaluation.cards
          ? "All card in this deck are legal"
          : `This deck contains cards that are not legal in ${titleCase(
              format
            )}`}
      </Text>

      <Text>
        {legalityEvaluation.size
          ? restrictions?.deckMaxSize
            ? `This deck is the proper size (${restrictions.deckMaxSize} cards)`
            : `This deck ahs the proper minimum size (${
                restrictions!.deckMinSize
              } cards)`
          : `This deck does not meet the format size requirement (${format}: ${restrictions?.deckMinSize})`}
      </Text>

      <Text>
        {legalityEvaluation.unique
          ? `All cards in this deck are within the unique card limit (Max: ${restrictions?.uniqueCardCount})`
          : `Cards in this deck exceed the unique card limit (Max: ${restrictions?.uniqueCardCount})`}
      </Text>

      {legalityEvaluation.rarity && (
        <Text>
          {restrictions?.maxRarity
            ? `All cards in this deck are the proper rarity (${
                restrictions.maxRarity === MTGRarities.COMMON
                  ? titleCase(restrictions.maxRarity)
                  : `${titleCase(restrictions.maxRarity)} or less`
              })`
            : `Cards in this deck are above the specified rarity (${restrictions?.maxRarity})`}
        </Text>
      )}

      {legalityEvaluation.tix && (
        <Text>
          {restrictions?.maxTix
            ? `All cards in this deck are under the specified price (${restrictions.maxTix})`
            : `Cards in this deck have a price above the specified amount (${restrictions?.maxTix})`}
        </Text>
      )}
    </View>
  );
}
