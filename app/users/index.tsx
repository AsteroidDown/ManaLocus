import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import Pagination from "@/components/ui/pagination/pagination";
import Table, { TableColumn } from "@/components/ui/table/table";
import Text from "@/components/ui/text/text";
import BodyHeightContext from "@/contexts/ui/body-height.context";
import { PaginationMeta } from "@/hooks/pagination";
import UserService from "@/hooks/services/user.service";
import { User } from "@/models/user/user";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import moment from "moment";
import React, { useContext, useEffect, useRef } from "react";
import { SafeAreaView, View } from "react-native";

export default function UsersPage() {
  const { setBodyHeight } = useContext(BodyHeightContext);

  const containerRef = useRef<SafeAreaView>(null);

  const [page, setPage] = React.useState(1);
  const [meta, setMeta] = React.useState(null as PaginationMeta | null);
  const [search, setSearch] = React.useState("");
  const [users, setUsers] = React.useState([] as User[]);

  function searchUsers() {
    UserService.getMany({ search }, { items: meta?.items || 25, page }).then(
      (response) => {
        setMeta(response.meta);
        setUsers(response.data);
      }
    );
  }

  useEffect(() => {
    UserService.getMany({ search }).then((response) => {
      setMeta(response.meta);
      setUsers(response.data);
    });
  }, [page]);

  return (
    <SafeAreaView
      ref={containerRef}
      onLayout={() =>
        containerRef.current?.measureInWindow((_x, _y, _width, height) =>
          setBodyHeight(height)
        )
      }
    >
      <View className="flex flex-1 gap-4 lg:px-16 px-4 py-8 min-h-[100dvh] bg-background-100">
        <BoxHeader title="Find Users" className="!pb-0" />

        <View className="flex flex-row gap-4 items-center">
          <Input
            label="Search"
            placeholder="Search for a user"
            onChange={setSearch}
          />

          <Button
            text="Search"
            className="self-end"
            icon={faSearch}
            onClick={searchUsers}
          />
        </View>

        <Table
          data={users}
          rowClick={(user) => router.push(`users/${user.id}`)}
          columns={
            [
              {
                title: "Name",
                row: (user) => <Text>{user.name}</Text>,
              },
              {
                title: "Decks",
                row: (user) => <Text>{user.deckCount}</Text>,
              },
              {
                title: "Member Since",
                row: (user) => (
                  <Text>{moment(user.memberSince).format("MMM Do, YYYY")}</Text>
                ),
              },
            ] as TableColumn<User>[]
          }
        />

        {meta && <Pagination meta={meta} onChange={(page) => setPage(page)} />}
      </View>
    </SafeAreaView>
  );
}
