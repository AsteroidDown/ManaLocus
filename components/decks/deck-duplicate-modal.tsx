import Text from "@/components/ui/text/text";
import { BoardTypes } from "@/constants/boards";
import DeckService from "@/hooks/services/deck.service";
import { Deck } from "@/models/deck/deck";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import Button from "../ui/button/button";
import Input from "../ui/input/input";
import Modal from "../ui/modal/modal";

export interface DeckDuplicateModalProps {
  deck: Deck;

  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeckDuplicateModal({
  deck,

  open,
  setOpen,
}: DeckDuplicateModalProps) {
  const [name, setName] = React.useState(deck.name);

  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  function copyDeck() {
    if (!name) return;

    setSaving(true);

    const dto = {
      name,
      description: deck.description,

      private: true,
      format: deck.format,

      colors: deck.colors,
      featuredArtUrl: deck.featuredArtUrl,

      cards: [
        ...deck.main.map((card) => ({
          scryfallId: card.scryfallId,
          name: card.name,
          count: card.count,
          board: BoardTypes.MAIN,
          group: card.group,
        })),
        ...deck.side.map((card) => ({
          scryfallId: card.scryfallId,
          name: card.name,
          count: card.count,
          board: BoardTypes.SIDE,
          group: card.group,
        })),
        ...deck.maybe.map((card) => ({
          scryfallId: card.scryfallId,
          name: card.name,
          count: card.count,
          board: BoardTypes.MAYBE,
          group: card.group,
        })),
        ...deck.acquire.map((card) => ({
          scryfallId: card.scryfallId,
          name: card.name,
          count: card.count,
          board: BoardTypes.ACQUIRE,
          group: card.group,
        })),
      ],

      dashboard: deck.dashboard?.sections || [],

      commanderId: deck.commander?.scryfallId,
    };

    DeckService.create(dto).then((response) => {
      setSaving(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setOpen(false);

        router.push(`decks/${response.deckId}/builder/main-board`);
      }, 2000);
    });
  }

  return (
    <Modal open={open} setOpen={setOpen}>
      <View className="flex gap-4 max-w-2xl min-w-96 max-h-[80vh]">
        <Text size="xl" thickness="bold">
          Copy Deck
        </Text>

        <Input
          label="New Deck Name"
          placeholder="Name your copy of the deck"
          value={deck.name}
          onChange={setName}
        />

        <Text size="xs" className="italic">
          This will create a new deck with the same cards and settings as the
          original and the copy will be marked as private
        </Text>

        <View className="flex flex-row justify-end">
          <Button
            disabled={!deck.name || saving}
            action={success ? "success" : "primary"}
            text={saving ? "Saving..." : success ? "Saved!" : "Save"}
            onClick={() => copyDeck()}
          />
        </View>
      </View>
    </Modal>
  );
}
