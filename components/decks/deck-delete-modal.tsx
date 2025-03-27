import ToastContext from "@/contexts/ui/toast.context";
import DeckService from "@/hooks/services/deck.service";
import { Deck } from "@/models/deck/deck";
import { router } from "expo-router";
import React, { useContext } from "react";
import { View } from "react-native";
import Button from "../ui/button/button";
import Modal from "../ui/modal/modal";
import Text from "../ui/text/text";

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
    <Modal
      open={open}
      setOpen={setOpen}
      title={`Delete ${deck.name}?`}
      footer={
        <View className="flex flex-row gap-2 justify-end">
          <Button
            size="sm"
            type="outlined"
            text="Cancel"
            onClick={() => setOpen(false)}
          />

          <Button
            size="sm"
            action="danger"
            disabled={!deck.name || saving}
            text={saving ? "Deleting..." : "Delete"}
            onClick={() => deleteDeck()}
          />
        </View>
      }
    >
      <Text>
        This action will delete the deck and all of its cards. This cannot be
        undone.
      </Text>
    </Modal>
  );
}
