import Input from "@/components/ui/input/input";
import Modal from "@/components/ui/modal/modal";
import Text from "@/components/ui/text/text";
import UserContext from "@/contexts/user/user.context";
import FolderService from "@/hooks/services/folder.service";
import { DeckFolder } from "@/models/folder/folder";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import Button from "../ui/button/button";

export interface FolderDetailsModalProps {
  folder?: DeckFolder;

  setSelectedFolderId?: React.Dispatch<React.SetStateAction<string | null>>;

  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FolderDetailsModal({
  folder,
  setSelectedFolderId,
  open,
  setOpen,
}: FolderDetailsModalProps) {
  const { user } = useContext(UserContext);

  const [name, setName] = React.useState("");

  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  useEffect(() => {
    if (!folder) return;

    setName(folder.name);
  }, [folder]);

  function createFolder() {
    if (!user) return;
    setSaving(true);

    FolderService.create(user.id, name ?? "New Folder").then((response) => {
      setSaving(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setName("");
        setOpen(false);
        setSelectedFolderId?.((response as any).folderId);
      }, 2000);
    });
  }

  function updateFolder() {
    if (!user || !folder || !name) return;
    setSaving(true);

    FolderService.update(user.id, folder.id, name).then(() => {
      setSaving(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setName("");
        setOpen(false);
        setSelectedFolderId?.(folder.id);
      }, 2000);
    });
  }

  return (
    <Modal open={open} setOpen={setOpen}>
      <View className="flex gap-4 min-w-96 max-w-2xl max-h-[80vh]">
        <Text size="xl" thickness="bold">
          {folder ? `Update ${folder.name}` : "Create Folder"}
        </Text>

        <Input
          label="Name"
          placeholder="Name your folder"
          value={name}
          onChange={setName}
        />

        <View className="flex flex-row justify-end">
          <Button
            disabled={!name || saving}
            action={success ? "success" : "primary"}
            text={
              saving
                ? "Saving..."
                : success
                ? folder
                  ? "Updated!"
                  : "Created!"
                : folder
                ? "Update"
                : "Create"
            }
            onClick={() => (!folder ? createFolder() : updateFolder())}
          />
        </View>
      </View>
    </Modal>
  );
}
