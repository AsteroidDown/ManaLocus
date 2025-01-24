import DecksTable from "@/components/decks/decks-table";
import Input from "@/components/ui/input/input";
import Modal from "@/components/ui/modal/modal";
import Pagination from "@/components/ui/pagination/pagination";
import Text from "@/components/ui/text/text";
import UserContext from "@/contexts/user/user.context";
import { PaginationMeta } from "@/hooks/pagination";
import DeckService from "@/hooks/services/deck.service";
import FolderService from "@/hooks/services/folder.service";
import { Deck } from "@/models/deck/deck";
import { DeckFolder } from "@/models/folder/folder";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";

export interface FolderDecksModalProps {
  folder: DeckFolder;

  setSelectedFolderId?: React.Dispatch<React.SetStateAction<string | null>>;

  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FolderDecksModal({
  folder,
  setSelectedFolderId,

  open,
  setOpen,
}: FolderDecksModalProps) {
  const { user } = useContext(UserContext);

  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");

  const [decks, setDecks] = React.useState([] as Deck[]);
  const [meta, setMeta] = React.useState(null as PaginationMeta | null);

  useEffect(() => {
    if (!user) return;

    DeckService.getByUser(
      user.id,
      { search, excludeIds: folder.deckIds },
      { page, items: 10 }
    ).then((decks) => {
      setMeta(decks.meta);
      setDecks(decks.data);
    });
  }, [search, page]);

  function toggleDeckInFolder(deckId: string) {
    if (!user) return;

    if (folder.deckIds.includes(deckId)) {
      FolderService.removeDeck(user.id, folder.id, deckId).then(() => {
        setSelectedFolderId?.(deckId);
        folder.deckIds.splice(folder.deckIds.indexOf(deckId), 1);
      });
    } else {
      FolderService.addDeck(user.id, folder.id, deckId).then(() => {
        setSelectedFolderId?.(deckId);
        folder.deckIds.push(deckId);
      });
    }
  }

  return (
    <Modal open={open} setOpen={setOpen}>
      <View className="flex gap-4 max-w-2xl max-h-[80vh]">
        <Text size="xl" thickness="bold">
          Add Deck to {folder.name}
        </Text>

        <Input
          label="Search"
          placeholder="Search for a deck"
          onChange={setSearch}
        />

        <DecksTable
          hideCreator
          hideModified
          hideFavorites
          hideViews
          decks={decks}
          rowClick={(deck) => toggleDeckInFolder(deck.id)}
          endColumns={[
            {
              fit: true,
              row: (deck) =>
                folder.deckIds.includes(deck.id) && (
                  <FontAwesomeIcon icon={faCheck} className="text-white" />
                ),
            },
          ]}
        />
        {meta && <Pagination meta={meta} onChange={(page) => setPage(page)} />}
      </View>
    </Modal>
  );
}
