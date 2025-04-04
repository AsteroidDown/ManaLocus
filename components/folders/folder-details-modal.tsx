import Input from "@/components/ui/input/input";
import Modal from "@/components/ui/modal/modal";
import ToastContext from "@/contexts/ui/toast.context";
import UserContext from "@/contexts/user/user.context";
import FolderService from "@/hooks/services/folder.service";
import { DeckFolder } from "@/models/folder/folder";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
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
  const { addToast } = useContext(ToastContext);

  const [name, setName] = React.useState("");

  const [saving, setSaving] = React.useState(false);

  useEffect(() => {
    if (!folder) return;

    setName(folder.name);
  }, [folder]);

  function createFolder() {
    if (!user || !user.verified || !name) return;
    setSaving(true);

    FolderService.create(user.id, name ?? "New Folder").then((response) => {
      setName("");
      setOpen(false);
      setSaving(false);
      setSelectedFolderId?.((response as any).folderId);

      addToast({
        action: "success",
        duration: 5000,
        title: `${name ?? "Folder"} Created!`,
        subtitle: "You can now view the details of your folder",
        content: (
          <Button
            size="xs"
            type="clear"
            text="View Folder"
            className="ml-auto"
            onClick={() =>
              router.push(
                `users/${user.id}/folders/${(response as any).folderId}`
              )
            }
          />
        ),
      });
    });
  }

  function updateFolder() {
    if (!user || !user.verified || !folder || !name) return;
    setSaving(true);

    FolderService.update(user.id, folder.id, name).then(() => {
      setName("");
      setOpen(false);
      setSaving(false);
      setSelectedFolderId?.(folder.id);

      addToast({
        action: "info",
        title: `${name ?? "Folder"} Updated!`,
        subtitle: "Your folder has been updated",
      });
    });
  }

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={folder ? `Update ${folder.name}` : "Create Folder"}
      footer={
        user &&
        user.verified && (
          <View className="flex flex-row justify-end">
            <Button
              size="sm"
              type="outlined"
              icon={faSave}
              disabled={!name || saving}
              text={saving ? "Saving..." : folder ? "Update" : "Create"}
              onClick={() => (!folder ? createFolder() : updateFolder())}
            />
          </View>
        )
      }
    >
      <View className="flex gap-4 min-w-96 max-w-2xl max-h-[80vh]">
        <Input
          label="Name"
          placeholder="Name your folder"
          value={name}
          onChange={setName}
        />
      </View>
    </Modal>
  );
}
