import { BoardTypes } from "@/constants/boards";
import StoredCardsContext from "@/contexts/cards/stored-cards.context";
import ToastContext from "@/contexts/ui/toast.context";
import {
  getLocalStorageStoredCards,
  removeFromLocalStorageCardCount,
} from "@/functions/local-storage/card-local-storage";
import { removeLocalStorageKit } from "@/functions/local-storage/kits-local-storage";
import DeckService from "@/hooks/services/deck.service";
import { Deck } from "@/models/deck/deck";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { View } from "react-native";
import Button from "../ui/button/button";
import Checkbox from "../ui/checkbox/checkbox";
import Modal from "../ui/modal/modal";
import Text from "../ui/text/text";

export interface RemoveKitModalProps {
  kit: Deck;
  deckKits: Deck[];
  setKitIndex: Dispatch<SetStateAction<number>>;
}

export default function RemoveKitModal({
  kit,
  deckKits,
  setKitIndex,
}: RemoveKitModalProps) {
  const { addToast } = useContext(ToastContext);
  const { setStoredCards } = useContext(StoredCardsContext);

  const [open, setOpen] = useState(false);

  const [removeCards, setRemoveCards] = useState(false);

  const [saving, setSaving] = useState(false);

  async function removeKit() {
    if (!kit) return;

    setSaving(true);

    const kitIndex = deckKits.findIndex((deckKit) => deckKit.id === kit.id);
    if (kitIndex < 0) return;

    if (removeCards) {
      await DeckService.get(kit.id).then((response) => {
        response.main.forEach((card) => {
          for (let i = 0; i < card.count; i++) {
            removeFromLocalStorageCardCount(card, BoardTypes.MAIN);
          }
        });

        const mainCards = getLocalStorageStoredCards(BoardTypes.MAIN);
        setStoredCards(mainCards);
      });
    }

    removeLocalStorageKit(kit);

    setSaving(false);
    setKitIndex(kitIndex);
    setOpen(false);
    setRemoveCards(false);

    addToast({
      action: "info",
      title: `${kit.name} Removed`,
      subtitle: `The ${kit.name} kit has been removed from your deck`,
    });
  }

  return (
    <View className="border-l -mr-4 border-background-300">
      <Button
        square
        type="clear"
        icon={faTrash}
        onClick={() => setOpen(true)}
      />

      <Modal
        open={open}
        setOpen={setOpen}
        title={`Remove ${kit.name}?`}
        footer={
          <View className="flex flex-row justify-between items-center gap-4">
            <Checkbox
              size="sm"
              label="Remove kit cards from deck as well"
              checked={removeCards}
              onChange={setRemoveCards}
            />

            <View className="flex flex-row gap-2 items-center">
              <Button
                size="sm"
                text="Cancel"
                type="outlined"
                onClick={() => setOpen(false)}
              />

              <Button
                size="sm"
                disabled={saving}
                text={saving ? "Removing..." : "Remove"}
                onClick={removeKit}
              />
            </View>
          </View>
        }
      >
        <View className="flex gap-4 max-w-2xl max-h-[80vh]">
          <Text>
            Are you sure you want to remove this kit from your deck? This action
            cannot be undone.
          </Text>
        </View>
      </Modal>
    </View>
  );
}
