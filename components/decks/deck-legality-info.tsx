import {
  MTGFormat,
  MTGFormatRestrictionsMap,
} from "@/constants/mtg/mtg-format";
import { LegalityEvaluation } from "@/constants/mtg/mtg-legality";
import { MTGRarities } from "@/constants/mtg/mtg-rarity";
import { titleCase } from "@/functions/text-manipulation";
import {
  faCheckCircle,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { View } from "react-native";
import Icon from "../ui/icon/icon";
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
      <Text size="lg" weight="semi">
        This deck is
        <Text
          size="md"
          weight="semi"
          action={legalityEvaluation.legal ? "success" : "danger"}
        >
          {legalityEvaluation.legal ? " " : " not "}legal
        </Text>
      </Text>

      {"commander" in legalityEvaluation && (
        <View className="flex flex-row items-center gap-2">
          <Icon
            icon={legalityEvaluation.commander ? faCheckCircle : faCircleXmark}
            className={
              legalityEvaluation.commander
                ? "!text-success-400"
                : "!text-danger-400"
            }
          />
          <Text size="sm">This deck has a legal commander</Text>
        </View>
      )}

      <View className="flex flex-row items-center gap-2">
        <Icon
          icon={legalityEvaluation.size ? faCheckCircle : faCircleXmark}
          className={
            legalityEvaluation.size ? "!text-success-400" : "!text-danger-400"
          }
        />
        <Text size="sm">
          {legalityEvaluation.size
            ? restrictions?.deckMaxSize
              ? `This deck is the correct size (${restrictions.deckMaxSize} cards)`
              : `This deck has the proper minimum size (${
                  restrictions!.deckMinSize
                } cards)`
            : `This deck is not the proper size (${titleCase(format)}: ${
                restrictions?.deckMinSize
              })`}
        </Text>
      </View>

      <View className="flex flex-row items-center gap-2">
        <Icon
          icon={legalityEvaluation.cards ? faCheckCircle : faCircleXmark}
          className={
            legalityEvaluation.cards ? "!text-success-400" : "!text-danger-400"
          }
        />
        <Text size="sm">
          {legalityEvaluation.cards
            ? `Each card is ${titleCase(format)} legal`
            : `Not all cards are ${titleCase(format)} legal`}
        </Text>
      </View>

      {"colorIdentity" in legalityEvaluation && (
        <View className="flex flex-row items-center gap-2">
          <Icon
            icon={
              legalityEvaluation.colorIdentity ? faCheckCircle : faCircleXmark
            }
            className={
              legalityEvaluation.colorIdentity
                ? "!text-success-400"
                : "!text-danger-400"
            }
          />
          <Text size="sm">
            {legalityEvaluation.colorIdentity
              ? `Each card is in the commander's color identity`
              : `Some cards are outside the commander's color identity`}
          </Text>
        </View>
      )}

      <View className="flex flex-row items-center gap-2">
        <Icon
          icon={legalityEvaluation.unique ? faCheckCircle : faCircleXmark}
          className={
            legalityEvaluation.unique ? "!text-success-400" : "!text-danger-400"
          }
        />
        <Text size="sm">
          {legalityEvaluation.unique
            ? `Each card in this deck has no more than ${restrictions?.uniqueCardCount} copies`
            : `Cards in this deck exceed the ${restrictions?.uniqueCardCount} copy limit`}
        </Text>
      </View>

      {"rarity" in legalityEvaluation && (
        <View className="flex flex-row items-center gap-2">
          <Icon
            icon={legalityEvaluation.rarity ? faCheckCircle : faCircleXmark}
            className={
              legalityEvaluation.rarity
                ? "!text-success-400"
                : "!text-danger-400"
            }
          />
          <Text size="sm">
            {restrictions?.maxRarity
              ? `Each card is the correct rarity (${
                  restrictions.maxRarity === MTGRarities.COMMON
                    ? titleCase(restrictions.maxRarity)
                    : `${titleCase(restrictions.maxRarity)} or less`
                })`
              : `Cards in this deck exceed the specified rarity (${restrictions?.maxRarity})`}
          </Text>
        </View>
      )}

      {"tix" in legalityEvaluation && (
        <Text size="sm">
          {restrictions?.maxTix
            ? `Each cards is under the specified tix amount (${restrictions.maxTix})`
            : `Cards in this deck exceed the specified tix amount (${restrictions?.maxTix})`}
        </Text>
      )}
    </View>
  );
}
