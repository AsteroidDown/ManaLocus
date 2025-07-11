import FolderDetailsModal from "@/components/folders/folder-details-modal";
import { FolderOptionsMenu } from "@/components/folders/folder-options-menu";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import Footer from "@/components/ui/navigation/footer";
import Pagination from "@/components/ui/pagination/pagination";
import Placeholder from "@/components/ui/placeholder/placeholder";
import Table, { TableColumn } from "@/components/ui/table/table";
import Text from "@/components/ui/text/text";
import Tooltip from "@/components/ui/tooltip/tooltip";
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
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";

export default function UserFoldersPage() {
  const { user } = useContext(UserContext);
  const { userPageUser } = useContext(UserPageContext);

  if (!userPageUser) return null;

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null as PaginationMeta | null);
  const [loading, setLoading] = useState(false);

  const [folders, setFolders] = useState([] as DeckFolder[]);
  const [search, setSearch] = useState("");

  const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false);

  const [selectedFolderId, setSelectedFolderId] = useState(
    null as string | null
  );

  useEffect(() => {
    if (!userPageUser.id) return;
    setLoading(true);

    FolderService.getMany(userPageUser.id, { search }).then((data) => {
      setMeta(data.meta);
      setFolders(data.data);
      setLoading(false);
    });
  }, [userPageUser, search, page, selectedFolderId]);

  return (
    <SafeAreaView className="flex-1 w-full h-full bg-background-100">
      <View className="lg:px-16 px-4 py-4 min-h-[100dvh] bg-background-100">
        <BoxHeader
          title={`${
            user?.id === userPageUser.id ? "Your" : `${userPageUser.name}'s`
          } Folders`}
          subtitle={
            <View className="flex items-start">
              <Text>
                {user?.id === userPageUser.id
                  ? "View and manage your folder"
                  : `See how ${userPageUser.name} manages their collection`}
              </Text>
              {user?.id === userPageUser.id &&
                (user?.access?.folderCount || 0) > 0 && (
                  <Tooltip text="To get more folder space, join our Patreon!">
                    <Text center italic size="xs" className="!text-dark-600">
                      (Folders created {user?.folderCount}/
                      {user?.access?.folderCount})
                    </Text>
                  </Tooltip>
                )}
            </View>
          }
          end={
            user &&
            userPageUser.id === user.id &&
            user.verified && (
              <Button
                size="sm"
                text="Folder"
                icon={faPlus}
                type="outlined"
                className="self-end"
                onClick={() => setCreateFolderModalOpen(true)}
                disabled={
                  (user?.access?.folderCount || 0) > 0 &&
                  (user?.folderCount || 0) >= (user?.access?.folderCount || 0)
                }
              />
            )
          }
        />

        <View className="flex flex-row justify-between gap-4 mb-6">
          <Input
            label="Search"
            placeholder="Search for a folder"
            onChange={setSearch}
          />
        </View>

        {!folders.length && (
          <Placeholder
            title="No Folders Found"
            subtitle={
              search
                ? `Try searching for something else`
                : user?.id === userPageUser.id
                ? `Create a folder and it will show up here!`
                : `${userPageUser.name} doesn't have any folders yet`
            }
          >
            {user?.id === userPageUser.id && (
              <Button
                size="sm"
                text="Folder"
                icon={faPlus}
                type="outlined"
                className="self-end"
                onClick={() => setCreateFolderModalOpen(true)}
              />
            )}
          </Placeholder>
        )}

        <Table
          className="mb-2"
          loading={loading}
          data={folders}
          rowClick={(folder) =>
            router.push(`users/${userPageUser.name}/folders/${folder.id}`)
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
                        `users/${userPageUser.name}/folders/${folder.id}`
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
                  <Text>{moment(folder.updated).format("MMM Do, YYYY")}</Text>
                ),
              },
              ...(user?.id === userPageUser.id && user.verified
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

        <FolderDetailsModal
          setSelectedFolderId={setSelectedFolderId}
          open={createFolderModalOpen}
          setOpen={setCreateFolderModalOpen}
        />
      </View>

      <Footer />
    </SafeAreaView>
  );
}
