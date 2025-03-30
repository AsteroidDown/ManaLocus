import { titleCase } from "@/functions/text-manipulation";
import ScryfallService from "@/hooks/services/scryfall.service";
import { Card } from "@/models/card/card";
import { Ruling } from "@/models/card/ruling";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Button from "../ui/button/button";
import Divider from "../ui/divider/divider";
import Text from "../ui/text/text";
import CardText from "./card-text";

export interface CardRulingsProps {
  card: Card;
}

export default function CardRulings({ card }: CardRulingsProps) {
  const [rulings, setRulings] = useState([] as Ruling[]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
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
        <Text size="lg" weight="bold">
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

      <Divider thick />

      <View
        className={`${
          open ? "max-h-[500px]" : "max-h-0"
        } flex lg:flex-row lg:flex-wrap gap-2 max-w-full rounded-lg overflow-y-scroll transition-all duration-300`}
      >
        {rulings?.map((ruling, index) => (
          <View
            key={index}
            className="flex-1 flex basis-1/3 lg:max-w-[50%] border-2 border-background-200 rounded-lg"
          >
            <View className="px-4 py-2">
              <CardText text={ruling.comment} />
            </View>

            <View className="flex flex-row justify-between items-center gap-2 mt-auto px-4 py-2 border-t-2 border-background-200">
              <Text size="sm" weight="semi">
                Source:{" "}
                {ruling.source === "wotc"
                  ? "Wizards of the Coast"
                  : titleCase(ruling.source)}
              </Text>

              <Text size="sm" weight="semi">
                {moment(ruling.publishedAt).format("MMM Do, YYYY")}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
