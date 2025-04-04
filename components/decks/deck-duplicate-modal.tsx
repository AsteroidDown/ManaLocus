import Text from "@/components/ui/text/text";
import { BoardTypes } from "@/constants/boards";
import ToastContext from "@/contexts/ui/toast.context";
import UserContext from "@/contexts/user/user.context";
import DeckService from "@/hooks/services/deck.service";
import { Deck } from "@/models/deck/deck";
import { faCopy, faRotate } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import React, { useContext } from "react";
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
  const { user } = useContext(UserContext);
  const { addToast } = useContext(ToastContext);

  const [name, setName] = React.useState(deck.name);

  const [saving, setSaving] = React.useState(false);

  function copyDeck() {
    if (!name || !user || !user.verified) return;

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

      setOpen(false);

      router.push(`decks/${response.deckId}/builder/main-board`);

      addToast({
        action: "success",
        title: `${name ?? deck.name ?? "Deck"} Duplicated!`,
        subtitle: `Your ${
          deck.isKit ? "kit" : deck.isCollection ? "collection" : "deck"
        } is ready to be built!`,
      });
    });
  }

  return (
    <Modal
      open={open}
      icon={faCopy}
      setOpen={setOpen}
      title="Copy Deck"
      footer={
        <View className="flex flex-row gap-2 justify-end">
          <Button
            size="sm"
            type="outlined"
            icon={saving ? faRotate : faCopy}
            disabled={!deck.name || saving}
            text={saving ? "Creating..." : "Create"}
            onClick={copyDeck}
          />
        </View>
      }
    >
      <View className="flex gap-4 max-w-xl min-w-96 max-h-[80vh]">
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
      </View>
    </Modal>
  );
}
