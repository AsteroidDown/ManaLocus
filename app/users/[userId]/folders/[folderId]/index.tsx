import DeckGallery from "@/components/decks/deck-gallery";
import FolderDecksModal from "@/components/folders/folder-decks-modal";
import FolderDetailsModal from "@/components/folders/folder-details-modal";
import Button from "@/components/ui/button/button";
import Modal from "@/components/ui/modal/modal";
import Placeholder from "@/components/ui/placeholder/placeholder";
import Text from "@/components/ui/text/text";
import BodyHeightContext from "@/contexts/ui/body-height.context";
import ToastContext from "@/contexts/ui/toast.context";
import UserPageContext from "@/contexts/user/user-page.context";
import UserContext from "@/contexts/user/user.context";
import FolderService from "@/hooks/services/folder.service";
import { Deck } from "@/models/deck/deck";
import { DeckFolder } from "@/models/folder/folder";
import {
  faChevronLeft,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useRef } from "react";
import { SafeAreaView, View } from "react-native";

export default function FolderPage() {
  const { folderId } = useLocalSearchParams();

  const { user } = useContext(UserContext);
  const { userPageUser } = useContext(UserPageContext);
  const { setBodyHeight } = useContext(BodyHeightContext);

  const containerRef = useRef<View>(null);

  const [folder, setFolder] = React.useState(null as DeckFolder | null);
  const [deckIds, setDeckIds] = React.useState([] as string[]);

  const [folderUpdateModalOpen, setFolderUpdateModalOpen] =
    React.useState(false);
  const [addDeckModalOpen, setAddDeckModalOpen] = React.useState(false);

  useEffect(() => {
    if (!userPageUser || typeof folderId !== "string") return;

    FolderService.get(userPageUser.id, folderId).then((response) => {
      setFolder(response);
      setDeckIds(response.deckIds);
    });
  }, [folderId]);

  if (!folder) return null;

  return (
    <SafeAreaView className="flex w-full h-full py-4 bg-background-100">
      <View
        ref={containerRef}
        className="flex flex-row gap-2 justify-between items-center mb-4"
        onLayout={() =>
          containerRef.current?.measureInWindow((_x, _y, _width, height) =>
            setBodyHeight(height)
          )
        }
      >
        <View className="flex flex-row items-center gap-2">
          <Button
            rounded
            type="clear"
            action="default"
            className="-ml-4"
            icon={faChevronLeft}
            onClick={() => router.push(`users/${userPageUser?.id}/folders`)}
          />

          <Text size="2xl" thickness="bold">
            {folder.name}
          </Text>
        </View>

        {user?.id === userPageUser?.id && (
          <View className="flex flex-row">
            <Button
              squareRight
              type="outlined"
              icon={faPen}
              onClick={() => setFolderUpdateModalOpen(true)}
            />
            <Button
              squareLeft
              type="outlined"
              icon={faPlus}
              onClick={() => setAddDeckModalOpen(true)}
            />
          </View>
        )}
      </View>

      {deckIds?.length > 0 ? (
        <DeckGallery
          noLoadScreen
          includeIds={deckIds}
          endColumns={[
            {
              fit: true,
              row: (deck) => (
                <FolderRemoveDeckModal
                  folder={folder}
                  deck={deck}
                  deckIds={deckIds}
                  setDeckIds={setDeckIds}
                />
              ),
            },
          ]}
        />
      ) : (
        <Placeholder
          title="No Decks Found!"
          subtitle="Add a deck to this folder and it will be shown here!"
          className="max-h-[300px]"
        />
      )}

      <FolderDetailsModal
        folder={folder}
        open={folderUpdateModalOpen}
        setOpen={setFolderUpdateModalOpen}
      />

      <FolderDecksModal
        folder={folder}
        open={addDeckModalOpen}
        setOpen={setAddDeckModalOpen}
      />
    </SafeAreaView>
  );
}

export interface FolderRemoveDeckModalProps {
  folder: DeckFolder;
  deck: Deck;
  deckIds: string[];
  setDeckIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export function FolderRemoveDeckModal({
  folder,
  deck,
  deckIds,
  setDeckIds,
}: FolderRemoveDeckModalProps) {
  const { user } = useContext(UserContext);
  const { addToast } = useContext(ToastContext);

  const [open, setOpen] = React.useState(false);

  const [saving, setSaving] = React.useState(false);

  function removeDeck() {
    if (!user) return;

    setSaving(true);
    FolderService.removeDeck(user.id, folder.id, deck.id).then(() => {
      setOpen(false);
      setSaving(false);
      setDeckIds(deckIds.filter((id) => id !== deck.id));

      addToast({
        action: "info",
        title: `${deck.name} removed from ${folder.name}`,
        subtitle: "Your deck has been removed from the folder",
      });
    });
  }

  return (
    <View className="border-l -mr-4 border-background-300">
      <Button
        square
        type="clear"
        action="default"
        icon={faTrash}
        onClick={() => setOpen(true)}
      />

      <Modal open={open} setOpen={setOpen}>
        <View className="flex gap-4 max-w-2xl max-h-[80vh]">
          <Text size="xl" thickness="bold">
            Remove {deck.name} from {folder.name}?
          </Text>

          <Text>
            This action can't be undone. Are you sure you want to continue?
          </Text>

          <View className="flex flex-row justify-end">
            <Button
              action="danger"
              disabled={saving}
              text={saving ? "Removing..." : "Remove"}
              onClick={removeDeck}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
