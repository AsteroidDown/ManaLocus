import { Card } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import CardDetailedPreview from "../cards/card-detailed-preview";
import Modal from "../ui/modal/modal";
import Text from "../ui/text/text";

export interface DescriptionSection {
  type: "text" | "card";
  text: string;
  card?: Card;
}

export interface DeckDescriptionProps {
  deck: Deck;
}

export default function DeckDescription({ deck }: DeckDescriptionProps) {
  const [sections, setSections] = useState([] as DescriptionSection[]);

  const [card, setCard] = useState(null as Card | null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!deck || !deck.description) return;

    const foundSections: DescriptionSection[] = [];

    const foundCards = deck.description.split("[[");
    if (!foundCards.length) {
      setSections([{ type: "text", text: deck.description }]);
    }

    foundCards.forEach((foundCard) => {
      const cardAndText = foundCard.split("]]");
      if (!cardAndText.length) return;

      if (cardAndText.length === 1) {
        foundSections.push({ type: "text", text: cardAndText[0] });
        return;
      }

      const card = deck.main.find((card) =>
        card.name.toLowerCase().includes(cardAndText[0].toLowerCase())
      );

      foundSections.push({ type: "card", text: cardAndText[0], card });

      if (cardAndText.length > 1) {
        foundSections.push({ type: "text", text: cardAndText[1] });
      }
    });

    setSections(foundSections);
  }, [deck]);

  useEffect(() => {
    if (!card) return;

    setOpen(true);
  }, [card]);

  return (
    <View className="flex px-4">
      <Text>
        {sections.map((section, index) => (
          <Text key={index}>
            {section.type === "text" ? (
              section.text
            ) : section.card ? (
              <Pressable onPress={() => setCard(section.card!)}>
                <Text action="primary">{section.text}</Text>
              </Pressable>
            ) : (
              <Text>{section.text}</Text>
            )}
          </Text>
        ))}
      </Text>

      <View className="-mt-0.5">
        <Modal open={open} setOpen={setOpen}>
          {card && (
            <CardDetailedPreview
              link
              fullHeight
              onLinkPress={() => setOpen(false)}
              card={card}
            />
          )}
        </Modal>
      </View>
    </View>
  );
}
