import {
  getLocalStorageKits,
  setLocalStorageKits,
} from "@/functions/local-storage/kits-local-storage";
import DeckService from "@/hooks/services/deck.service";
import { Deck } from "@/models/deck/deck";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import AddKitModal from "../kits/add-kit-modal";
import KitModal from "../kits/kit-modal";
import RemoveKitModal from "../kits/remove-kit-modal";
import Button from "../ui/button/button";
import Divider from "../ui/divider/divider";
import Text from "../ui/text/text";
import DecksTable from "./decks-table";

export interface DeckKitProps {
  deck: Deck;

  readonly?: boolean;
}

export default function DeckKits({ deck, readonly }: DeckKitProps) {
  const width = useWindowDimensions().width;

  const [deckKits, setDeckKits] = useState([] as Deck[]);

  const [loading, setLoading] = useState(false);

  const [selectedKit, setSelectedKit] = useState(null as Deck | null);
  const [kitModalOpen, setKitModalOpen] = useState(false);
  const [addKitModalOpen, setAddKitModalOpen] = useState(false);

  const [kitIndex, setKitIndex] = useState(0);

  useEffect(() => {
    if (!deck || getLocalStorageKits()?.length) return;
    setLoading(true);

    DeckService.getDeckKits(deck.id).then((deckKits) => {
      setDeckKits(deckKits);
      setLoading(false);

      if (!readonly) {
        setLocalStorageKits(deckKits);
        setKitIndex(-1);
      }
    });
  }, [deck]);

  useEffect(() => setDeckKits(getLocalStorageKits()), [kitIndex]);

  if (readonly && !deckKits?.length) return null;

  return (
    <View className="flex">
      <View className="flex flex-row justify-between items-center gap-4">
        <Text size="lg" weight="bold">
          {readonly ? "Kits in Deck" : "Kits"}
        </Text>

        {!readonly && (
          <Button
            text="Add Kit"
            type="clear"
            icon={faPlus}
            onClick={() => setAddKitModalOpen(true)}
          />
        )}
      </View>

      <Divider
        thick
        className={`${readonly ? "my-4" : ""} !border-background-200`}
      />

      <View>
        {deckKits?.length > 0 && (
          <DecksTable
            hideViews
            hideFormat
            hideModified
            hideFavorites
            hideCreator={!readonly && width <= 600}
            decks={deckKits}
            loading={loading}
            hideHeader={!readonly}
            rowClick={(kit) => {
              setSelectedKit(kit);
              setKitModalOpen(true);
            }}
            endColumns={
              !readonly
                ? [
                    {
                      fit: true,
                      row: (kit) => (
                        <RemoveKitModal
                          kit={kit}
                          deckKits={deckKits}
                          setKitIndex={setKitIndex}
                        />
                      ),
                    },
                  ]
                : []
            }
          />
        )}
      </View>

      {selectedKit && (
        <KitModal
          kit={selectedKit}
          open={kitModalOpen}
          setOpen={setKitModalOpen}
        />
      )}

      <AddKitModal
        deck={deck}
        deckKits={deckKits}
        open={addKitModalOpen}
        setOpen={setAddKitModalOpen}
        setKitIndex={setKitIndex}
      />
    </View>
  );
}
