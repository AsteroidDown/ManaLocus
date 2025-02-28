import Text from "@/components/ui/text/text";
import ToastContext from "@/contexts/ui/toast.context";
import DeckService from "@/hooks/services/deck.service";
import { Deck } from "@/models/deck/deck";
import { router } from "expo-router";
import React, { useContext } from "react";
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
  const { addToast } = useContext(ToastContext);
  const [saving, setSaving] = React.useState(false);

  function deleteDeck() {
    if (!deck.userId) return;

    setSaving(true);

    DeckService.remove(deck.id).then(() => {
      setSaving(false);
      setOpen(false);
      router.push(`decks`);

      addToast({
        action: "info",
        title: `${deck.name} Deleted`,
        subtitle: "Your deck has been deleted",
      });
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
            action="danger"
            disabled={!deck.name || saving}
            text={saving ? "Deleting..." : "Delete"}
            onClick={() => deleteDeck()}
          />
        </View>
      </View>
    </Modal>
  );
}
