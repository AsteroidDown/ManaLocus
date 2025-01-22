import { titleCase } from "@/functions/text-manipulation";
import ScryfallService from "@/hooks/services/scryfall.service";
import { Card } from "@/models/card/card";
import { Ruling } from "@/models/card/ruling";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import React from "react";
import { Pressable, View } from "react-native";
import Button from "../ui/button/button";
import Divider from "../ui/divider/divider";
import Text from "../ui/text/text";
import CardText from "./card-text";

export interface CardRulingsProps {
  card: Card;
}

export default function CardRulings({ card }: CardRulingsProps) {
  const [rulings, setRulings] = React.useState([] as Ruling[]);

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!card) return;

    ScryfallService.getCardRulings(card.scryfallId).then((rulings) =>
      setRulings(rulings)
    );
  }, [card]);

  if (!rulings?.length) return null;

  return (
    <View className="flex gap-2">
      <Pressable
        className="flex flex-row justify-between items-center gap-2"
        onPress={() => setOpen(!open)}
      >
        <Text size="lg" thickness="bold">
          Rulings
        </Text>

        <Button
          rounded
          type="clear"
          action="default"
          icon={faChevronDown}
          className={`${
            open ? "rotate-[540deg]" : ""
          } transition-all duration-300`}
          onClick={() => setOpen(!open)}
        />
      </Pressable>

      <Divider thick className="!border-background-200" />

      <View
        className={`${
          open ? "max-h-[500px]" : "max-h-0"
        } flex gap-2 max-w-full rounded-lg overflow-y-scroll transition-all duration-300`}
      >
        {rulings?.map((ruling, index) => (
          <View key={index}>
            <View className="flex gap-2 px-4 py-2">
              <CardText text={ruling.comment} />

              <View className="flex flex-row justify-between items-center gap-2">
                <Text size="sm" thickness="semi">
                  Source:{" "}
                  {ruling.source === "wotc"
                    ? "Wizards of the Coast"
                    : titleCase(ruling.source)}
                </Text>

                <Text size="sm" thickness="semi">
                  {moment(ruling.publishedAt).format("MMM D, YYYY")}
                </Text>
              </View>
            </View>

            <Divider thick className="!border-background-200" />
          </View>
        ))}
      </View>
    </View>
  );
}
