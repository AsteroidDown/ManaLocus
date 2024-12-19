import ScryfallService from "@/hooks/services/scryfall.service";
import { Card, CardIdentifier, CardPartTypes } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";
import {
  faChevronDown,
  faList,
  faShop,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Linking, Pressable, View } from "react-native";
import CardDetailedPreview from "../cards/card-detailed-preview";
import CardImage from "../cards/card-image";
import Button from "../ui/button/button";
import Divider from "../ui/divider/divider";
import Modal from "../ui/modal/modal";
import Text from "../ui/text/text";

export interface DeckTokensProps {
  deck: Deck;
}

export default function DeckTokens({ deck }: DeckTokensProps) {
  const [open, setOpen] = React.useState(false);

  const [tokens, setTokens] = React.useState(
    [] as { creator: Card; token: Card }[]
  );

  React.useEffect(() => {
    const tokenIds: string[] = [];

    const tokenCards = deck.main.reduce((acc, card) => {
      if (!card.allParts) return acc;

      const cardTokenIds = card.allParts.reduce((cardAcc, part) => {
        if (
          part.component === CardPartTypes.TOKEN &&
          !tokenIds.includes(part.id)
        ) {
          cardAcc.push(part.id);
          tokenIds.push(part.id);
        }
        return cardAcc;
      }, [] as string[]);

      if (cardTokenIds.length) acc.push({ card, tokenIds: cardTokenIds });
      return acc;
    }, [] as { card: Card; tokenIds: string[] }[]);

    if (!tokenCards.length) return;

    ScryfallService.getCardsFromCollection(
      tokenCards.reduce((acc, card) => {
        acc.push(...card.tokenIds.map((id) => ({ id })));
        return acc;
      }, [] as CardIdentifier[])
    ).then((tokens) =>
      setTokens(
        tokens.map((token) => ({
          creator: tokenCards.find((card) =>
            card.tokenIds.includes(token.scryfallId)
          )!.card,
          token,
        }))
      )
    );
  }, [deck]);

  return (
    <View className="relative flex gap-2">
      <View className="sticky top-0 flex gap-2 bg-background-100 z-10">
        <Pressable
          className="flex flex-row justify-between items-center gap-4"
          onPress={() => setOpen(!open)}
        >
          <Text size="lg" thickness="bold">
            Tokens
          </Text>

          <Button
            rounded
            type="clear"
            action="default"
            icon={faChevronDown}
            className={`${
              open ? "rotate-180" : ""
            } transition-all duration-300`}
            onClick={() => setOpen(!open)}
          />
        </Pressable>

        <Divider thick className="!border-background-200 mb-2" />
      </View>

      <View
        className={`${
          open ? "max-h-[750px]" : "max-h-0"
        } overflow-hidden transition-all duration-300`}
      >
        <View className="flex flex-row flex-wrap gap-3 max-h-full overflow-y-auto">
          {tokens.map((token, index) => (
            <Token key={index} creator={token.creator} token={token.token} />
          ))}
        </View>
      </View>
    </View>
  );
}

export function Token({ creator, token }: { creator: Card; token: Card }) {
  const [open, setOpen] = React.useState(false);

  if (!token) return null;

  return (
    <Pressable
      className="flex gap-2 p-2 max-w-[248px] rounded-xl border-2 border-dark-200 hover:border-primary-200 bg-dark-100 transition-all duration-300"
      onPress={() => setOpen(true)}
    >
      <CardImage card={token} />

      <View className="flex px-2 max-w-full">
        <Text thickness="bold">{token.name}</Text>

        <Text size="xs" className="!text-gray-200">
          {token.typeLine}
        </Text>

        <Text size="xs" className="!text-gray-400 mt-1">
          From {creator.name}
        </Text>
      </View>

      <View className="-mt-0.5">
        <Modal open={open} setOpen={setOpen}>
          <CardDetailedPreview
            link
            onLinkPress={() => setOpen(false)}
            card={token}
            className="!p-0"
          >
            <View className="flex flex-row gap-2">
              <Button
                size="sm"
                action="info"
                className="flex-1"
                icon={faShop}
                text={`$${token.prices?.usd}`}
                onClick={async () =>
                  token.priceUris?.tcgplayer &&
                  (await Linking.openURL(token.priceUris.tcgplayer))
                }
              />

              <Button
                size="sm"
                action="info"
                className="flex-1"
                icon={faShop}
                text={`€${token.prices?.eur}`}
                onClick={async () =>
                  token.priceUris?.cardmarket &&
                  (await Linking.openURL(token.priceUris.cardmarket))
                }
              />
            </View>

            <Button
              text="More Details"
              className="flex-1 w-full"
              icon={faList}
            />
          </CardDetailedPreview>
        </Modal>
      </View>
    </Pressable>
  );
}
