import FolderDecksModal from "@/components/folders/folder-decks-modal";
import FolderDetailsModal from "@/components/folders/folder-details-modal";
import Box from "@/components/ui/box/box";
import Button from "@/components/ui/button/button";
import Dropdown from "@/components/ui/dropdown/dropdown";
import Modal from "@/components/ui/modal/modal";
import Text from "@/components/ui/text/text";
import UserContext from "@/contexts/user/user.context";
import FolderService from "@/hooks/services/folder.service";
import { DeckFolder } from "@/models/folder/folder";
import {
  faEllipsisV,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext } from "react";
import { View } from "react-native";

export interface FolderOptionsMenuProps {
  folder: DeckFolder;
  deckIds: string[];
  setSelectedFolderId: React.Dispatch<React.SetStateAction<string | null>>;
}

export function FolderOptionsMenu({
  folder,
  deckIds,
  setSelectedFolderId,
}: FolderOptionsMenuProps) {
  const { user } = useContext(UserContext);

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [addDeckOpen, setAddDeckOpen] = React.useState(false);
  const [updateFolderOpen, setUpdateFolderOpen] = React.useState(false);
  const [removeFolderOpen, setRemoveFolderOpen] = React.useState(false);

  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  function removeFolder() {
    if (!user) return;
    setSaving(true);

    FolderService.remove(user.id, folder.id).then(() => {
      setSaving(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setSelectedFolderId(folder.id);
      }, 2000);
    });
  }

  return (
    <View className="flex flex-row gap-2 items-center">
      <View className="flex border-l border-background-300 -mr-4">
        <Button
          square
          type="clear"
          action="default"
          icon={faEllipsisV}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />

        <Dropdown
          xOffset={-88}
          expanded={dropdownOpen}
          setExpanded={setDropdownOpen}
        >
          <Box className="flex justify-start items-start !p-0 border-2 border-primary-300 !bg-background-100 !bg-opacity-90 overflow-hidden">
            <Button
              start
              square
              type="clear"
              text=" Add Deck"
              className="w-full"
              icon={faPlus}
              onClick={() => {
                setDropdownOpen(false);
                setAddDeckOpen(true);
              }}
            />

            <Button
              start
              square
              type="clear"
              text="Rename"
              className="w-full"
              icon={faPen}
              onClick={() => {
                setDropdownOpen(false);
                setUpdateFolderOpen(true);
              }}
            />

            <Button
              start
              square
              type="clear"
              text=" Remove"
              className="w-full"
              icon={faTrash}
              onClick={() => {
                setDropdownOpen(false);
                setRemoveFolderOpen(true);
              }}
            />
          </Box>
        </Dropdown>
      </View>

      <View className="-mx-1">
        <FolderDecksModal
          folder={folder}
          open={addDeckOpen}
          setOpen={setAddDeckOpen}
          setSelectedFolderId={setSelectedFolderId}
        />

        <FolderDetailsModal
          folder={folder}
          open={updateFolderOpen}
          setOpen={setUpdateFolderOpen}
          setSelectedFolderId={setSelectedFolderId}
        />

        <Modal open={removeFolderOpen} setOpen={setRemoveFolderOpen}>
          <View className="flex gap-4 max-w-2xl max-h-[80vh]">
            <Text size="xl" thickness="bold">
              Remove {folder.name}?
            </Text>

            <Text>
              This action can't be undone. Are you sure you want to continue?
            </Text>

            <View className="flex flex-row justify-end">
              <Button
                icon={faTrash}
                disabled={saving}
                action={success ? "success" : "danger"}
                text={
                  saving ? "Removing..." : success ? "Folder Removed" : "Remove"
                }
                onClick={removeFolder}
              />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
