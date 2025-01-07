import Text from "@/components/ui/text/text";
import DeckService from "@/hooks/services/deck.service";
import { Deck } from "@/models/deck/deck";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import Button from "../ui/button/button";
import Modal from "../ui/modal/modal";

export interface DeckDeleteModalProps {
  deck: Deck;

  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeckDeleteModal({
  deck,

  open,
  setOpen,
}: DeckDeleteModalProps) {
  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  function deleteDeck() {
    if (!deck.userId) return;

    setSaving(true);

    DeckService.remove(deck.id).then(() => {
      setSaving(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
        router.push(`decks`);
      }, 2000);
    });
  }

  return (
    <Modal open={open} setOpen={setOpen}>
      <View className="flex gap-4 max-w-2xl min-w-96 max-h-[80vh]">
        <Text size="xl" thickness="bold">
          Delete {deck.name}?
        </Text>

        <Text>
          This action will delete the deck and all of its cards. This cannot be
          undone.
        </Text>

        <View className="flex flex-row gap-2 justify-end">
          <Button
            type="outlined"
            text="Cancel"
            onClick={() => setOpen(false)}
          />

          <Button
            disabled={!deck.name || saving}
            action={success ? "success" : "danger"}
            text={saving ? "Deleting..." : success ? "Deck Deleted" : "Delete"}
            onClick={() => deleteDeck()}
          />
        </View>
      </View>
    </Modal>
  );
}
