import FolderDetailsModal from "@/components/folders/folder-details-modal";
import { FolderOptionsMenu } from "@/components/folders/folder-options-menu";
import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import Pagination from "@/components/ui/pagination/pagination";
import Table, { TableColumn } from "@/components/ui/table/table";
import Text from "@/components/ui/text/text";
import UserPageContext from "@/contexts/user/user-page.context";
import UserContext from "@/contexts/user/user.context";
import { PaginationMeta } from "@/hooks/pagination";
import FolderService from "@/hooks/services/folder.service";
import { DeckFolder } from "@/models/folder/folder";
import {
  faFolder,
  faFolderOpen,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import moment from "moment";
import React, { useContext, useEffect } from "react";
import { SafeAreaView, View } from "react-native";

export default function UserFoldersPage() {
  const { user } = useContext(UserContext);
  const { userPageUser } = useContext(UserPageContext);

  if (!user || !userPageUser) return null;

  const [page, setPage] = React.useState(1);
  const [meta, setMeta] = React.useState(null as PaginationMeta | null);
  const [folders, setFolders] = React.useState([] as DeckFolder[]);
  const [search, setSearch] = React.useState("");

  const [createFolderModalOpen, setCreateFolderModalOpen] =
    React.useState(false);

  const [selectedFolderId, setSelectedFolderId] = React.useState(
    null as string | null
  );

  useEffect(() => {
    if (!userPageUser.id) return;

    FolderService.getMany(userPageUser.id, { search }).then((data) => {
      setMeta(data.meta);
      setFolders(data.data);
    });
  }, [userPageUser, search, page, selectedFolderId]);

  return (
    <SafeAreaView className="flex-1 w-full h-full bg-background-100">
      <View className="flex my-4">
        {user.id === userPageUser.id && (
          <View className="flex flex-row justify-between gap-4 mb-6">
            <Input
              label="Search"
              placeholder="Search for a folder"
              onChange={setSearch}
            />

            <Button
              type="outlined"
              text="Create Folder"
              className="self-end"
              icon={faPlus}
              onClick={() => setCreateFolderModalOpen(true)}
            />
          </View>
        )}

        <Table
          className="mb-2"
          data={folders}
          rowClick={(folder) =>
            router.push(`users/${userPageUser.id}/folders/${folder.id}`)
          }
          columns={
            [
              {
                fit: true,
                row: (folder) => (
                  <Button
                    square
                    type="clear"
                    action="default"
                    className="-ml-2 -mr-4"
                    icon={folder.deckIds?.length ? faFolderOpen : faFolder}
                    onClick={() =>
                      router.push(
                        `users/${userPageUser.id}/folders/${folder.id}`
                      )
                    }
                  />
                ),
              },
              {
                fit: true,
                title: "Name",
                row: (folder) => <Text>{folder.name}</Text>,
              },
              {
                title: "Decks",
                row: (folder) => <Text>{folder.deckIds?.length || 0}</Text>,
              },
              {
                fit: true,
                title: "Last Updated",
                row: (folder) => (
                  <Text>{moment(folder.updated).format("MMM D, YYYY")}</Text>
                ),
              },
              ...(user.id === userPageUser.id
                ? [
                    {
                      fit: true,
                      center: true,
                      row: (folder: DeckFolder) => (
                        <FolderOptionsMenu
                          folder={folder}
                          deckIds={folder.deckIds}
                          setSelectedFolderId={setSelectedFolderId}
                        />
                      ),
                    },
                  ]
                : []),
              ,
            ] as TableColumn<DeckFolder>[]
          }
        />

        {meta && <Pagination meta={meta} onChange={setPage} />}
      </View>

      <FolderDetailsModal
        setSelectedFolderId={setSelectedFolderId}
        open={createFolderModalOpen}
        setOpen={setCreateFolderModalOpen}
      />
    </SafeAreaView>
  );
}
