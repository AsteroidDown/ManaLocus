import Box from "@/components/ui/box/box";
import Button from "@/components/ui/button/button";
import ScryfallService from "@/hooks/services/scryfall.service";
import { Card } from "@/models/card/card";
import { faPalette } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import { Image, Pressable, View } from "react-native";
import Dropdown from "../ui/dropdown/dropdown";
import Text from "../ui/text/text";

export interface CardPrintsProps {
  card?: Card;
  setCard: React.Dispatch<React.SetStateAction<Card | undefined>>;
  iconOnly?: boolean;
  disabled?: boolean;
  tabbable?: boolean;
}

export default function CardPrints({
  card,
  setCard,
  iconOnly = false,
  disabled = false,
  tabbable = true,
}: CardPrintsProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [hoverIndex, setHoverIndex] = React.useState(null as number | null);
  const [cardPrints, setCardPrints] = React.useState([] as Card[]);

  useEffect(() => {
    if (!card) return;

    getCardArts(card);
  }, [card, disabled]);

  async function getCardArts(card: Card) {
    if (disabled) return;

    ScryfallService.getCardPrints(card.name).then((prints) =>
      setCardPrints(prints)
    );
  }

  return (
    <>
      <Button
        size="sm"
        type="outlined"
        className="flex-1"
        icon={faPalette}
        tabbable={tabbable}
        text={!iconOnly ? "Print" : ""}
        disabled={disabled || !card || (cardPrints.length || 0) < 2}
        onClick={() => setExpanded(!expanded)}
      />

      <View className="-my-2 -mx-1">
        <Dropdown
          horizontal="center"
          expanded={expanded}
          setExpanded={setExpanded}
          className={`!max-w-[392px]`}
        >
          <Box className="pb-6 mb-7 overflow-hidden !bg-background-100 border-2 border-primary-200 rounded-2xl shadow-xl">
            <Text size="lg" weight="bold" className="mb-2">
              {`Available Prints (${cardPrints.length})`}
            </Text>

            <View className="flex flex-row flex-wrap gap-2 max-h-[300px] rounded-xl overflow-y-auto ">
              {cardPrints.map((print, index) => (
                <Pressable
                  className={`flex gap-1 p-2 pb-1 rounded-lg transition-all duration-300 ${
                    hoverIndex === index
                      ? "bg-primary-300"
                      : "bg-background-200"
                  }`}
                  key={print.scryfallId + index}
                  onPointerEnter={() => setHoverIndex(index)}
                  onPointerLeave={() => setHoverIndex(null)}
                  onPress={() => {
                    setCard(print);
                    setExpanded(false);
                  }}
                >
                  <Image
                    className="h-32 aspect-[2.5/3.5]"
                    source={{
                      uri:
                        print.imageURIs?.png ||
                        print.faces?.front.imageUris.png,
                    }}
                  />

                  <View className="flex flex-row justify-center items-center gap-2">
                    <Text weight="medium">
                      {print.set.toUpperCase()}{" "}
                      {print.collectorNumber.toUpperCase()}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </Box>
        </Dropdown>
      </View>
    </>
  );
}
