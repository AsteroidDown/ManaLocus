import { Card } from "@/models/card/card";
import {
  SpellbookCombo,
  SpellbookComboCard,
  SpellbookComboResult,
} from "@/models/spellbook/spellbook-combo";
import {
  faArrowUpRightFromSquare,
  faCertificate,
  faCrown,
  faHand,
  faInfinity,
  faPersonDigging,
  faQuestion,
  faShop,
  faTableCells,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import { Dispatch, SetStateAction } from "react";
import { Linking, Pressable, useWindowDimensions, View } from "react-native";
import CardImage from "../cards/card-image";
import CardText from "../cards/card-text";
import Box from "../ui/box/box";
import Button from "../ui/button/button";
import Chip from "../ui/chip/chip";
import Divider from "../ui/divider/divider";
import Icon from "../ui/icon/icon";
import Text from "../ui/text/text";

export default function ComboDetails({
  combo,
  comboCards,
  setOpen,
}: {
  combo: SpellbookCombo;
  comboCards: Card[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const width = useWindowDimensions().width;

  const steps = combo.description
    .split("\n")
    .filter((step) => step.length > 0)
    .map((step) => step.trim().substring(0, step.length - 1));

  function getLocationText(card: SpellbookComboCard) {
    let text = card.card.name;

    if (card.zoneLocations.length === 1) {
      if (card.zoneLocations[0] === "H") text += " in hand";
      else if (card.zoneLocations[0] === "B") text += " on the battlefield";
      else if (card.zoneLocations[0] === "G") text += " in the graveyard";
      else if (card.zoneLocations[0] === "E") text += " in exile";
    }

    return text;
  }

  return (
    <View className="flex gap-4 max-w-[75dvw] lg:min-w-[600px] min-w-[350px]">
      <View className="px-4 lg:max-w-full max-w-[316px] overflow-x-auto">
        <View className="flex flex-row justify-center gap-2 min-w-fit">
          {comboCards.map((card, index) => (
            <Box
              key={card.scryfallId + index}
              className="flex gap-2 !p-1 min-w-fit border-2 border-dark-200 !bg-dark-200 !rounded-lg"
            >
              <Pressable
                className="-m-1"
                onPress={() => {
                  setOpen?.(false);
                  router.push(`cards/${card.set}/${card.collectorNumber}`);
                }}
              >
                <CardImage card={card} />
              </Pressable>

              <View className="flex flex-row gap-2 px-2 pb-0.5">
                <Button
                  size="xs"
                  action="info"
                  type="outlined"
                  className="flex-1"
                  icon={faShop}
                  text={`$${card.prices?.usd}`}
                  onClick={async () =>
                    card.priceUris?.tcgplayer &&
                    (await Linking.openURL(card.priceUris.tcgplayer))
                  }
                />

                <Button
                  size="xs"
                  action="info"
                  type="outlined"
                  className="flex-1"
                  icon={faShop}
                  text={`€${card.prices?.eur}`}
                  onClick={async () =>
                    card.priceUris?.cardmarket &&
                    (await Linking.openURL(card.priceUris.cardmarket))
                  }
                />
              </View>
            </Box>
          ))}
        </View>
      </View>

      <View className="flex-1 flex lg:flex-row gap-4">
        <View className="lg:flex-1 flex gap-4">
          <Text size="lg" weight="medium">
            Setup
          </Text>

          <Divider thick className="-my-2" />

          <View className="flex gap-1">
            <Text size="md" weight="medium">
              Initial Card State
            </Text>

            <Divider />

            {combo.uses
              .map((card) => getLocationText(card))
              .map((card) => (
                <View className="flex flex-row items-center gap-2" key={card}>
                  <View>
                    <Chip
                      size="sm"
                      startIcon={
                        card.includes("battlefield")
                          ? faTableCells
                          : card.includes("hand")
                          ? faHand
                          : card.includes("exile")
                          ? faXmark
                          : card.includes("graveyard")
                          ? faPersonDigging
                          : faQuestion
                      }
                    />
                  </View>

                  <Text size="sm">{card}</Text>
                </View>
              ))}
          </View>

          {combo.requires?.length > 0 && (
            <View className="flex gap-1">
              <Text size="md" weight="medium">
                Requires
              </Text>

              <Divider />

              {combo.requires.map((requirement) => (
                <Text
                  key={requirement.template.id}
                  size="sm"
                  className={width > 600 ? "" : "max-w-[256px]"}
                >
                  {requirement.template.name}

                  <Icon
                    className="ml-2"
                    icon={faArrowUpRightFromSquare}
                    onClick={() => {
                      setOpen?.(false);
                      router.push(
                        `cards/search?query=${requirement.template.scryfallQuery}`
                      );
                    }}
                  />
                </Text>
              ))}
            </View>
          )}

          {combo.easyPrerequisites?.length > 0 && (
            <View className="flex gap-1">
              <Text size="md" weight="medium">
                Easy Prerequisites
              </Text>

              <Divider />

              <CardText
                size="sm"
                text={combo.easyPrerequisites}
                className={width > 600 ? "" : "max-w-[256px]"}
              />
            </View>
          )}

          {combo.notablePrerequisites?.length > 0 && (
            <View className="flex gap-1">
              <Text size="md" weight="medium">
                Notable Prerequisites
              </Text>

              <Divider />

              <CardText
                size="sm"
                text={combo.notablePrerequisites}
                className={width > 600 ? "" : "max-w-[256px]"}
              />
            </View>
          )}

          {combo.manaNeeded?.length > 0 && (
            <View className="flex gap-1">
              <Text size="md" weight="medium">
                Mana Needed
              </Text>

              <Divider />

              <CardText
                size="sm"
                text={combo.manaNeeded}
                className={width > 600 ? "" : "max-w-[256px]"}
              />
            </View>
          )}
        </View>

        <View className="lg:flex-1 flex gap-2">
          <Text size="lg" weight="medium">
            Combo
          </Text>

          <Divider thick />

          <View className="flex flex-wrap">
            {steps.map((step, index) =>
              step?.length > 0 ? (
                <View key={index}>
                  <View className="flex flex-row items-start gap-3">
                    <View className="flex items-center w-[28px] min-h-full">
                      <Chip size="sm" text={index + 1 + ""} />

                      {index < steps.length - 1 && (
                        <Divider thick vertical className="flex-1 py-1 my-1" />
                      )}
                    </View>

                    <CardText
                      size="sm"
                      text={step}
                      className={`mt-1 mb-2 ${
                        width > 600 ? "flex-1" : "max-w-[256px]"
                      }`}
                    />
                  </View>
                </View>
              ) : null
            )}
          </View>
        </View>

        <View className="lg:flex-1 flex gap-2">
          <Text size="lg" weight="medium">
            Produces
          </Text>

          <Divider thick />

          <View className="flex flex-wrap gap-3">
            {combo.produces.map((result) => (
              <View
                key={result.feature.id}
                className="flex flex-row items-center gap-2"
              >
                <Chip size="sm" startIcon={getComboResultIcon(result)} />

                <CardText
                  size="sm"
                  text={result.feature.name}
                  className={width > 600 ? "flex-1" : "max-w-[256px]"}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

export function getComboResultIcon(feature: SpellbookComboResult) {
  const name = feature.feature.name.toLowerCase();

  if (name.includes("infinite")) {
    return faInfinity;
  } else if (name.includes("win")) {
    return faCrown;
  } else if (name.includes("exile")) {
    return faCertificate;
  } else return undefined;
}
