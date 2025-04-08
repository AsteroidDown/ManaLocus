import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import Footer from "@/components/ui/navigation/footer";
import Pagination from "@/components/ui/pagination/pagination";
import Table, { TableColumn } from "@/components/ui/table/table";
import Text from "@/components/ui/text/text";
import { PaginationMeta } from "@/hooks/pagination";
import UserService from "@/hooks/services/user.service";
import { User } from "@/models/user/user";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null as PaginationMeta | null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([] as User[]);

  const [loading, setLoading] = useState(false);

  function searchUsers() {
    setLoading(true);

    UserService.getMany({ search }, { items: meta?.items || 25, page }).then(
      (response) => {
        setLoading(false);
        setMeta(response.meta);
        setUsers(response.data);
      }
    );
  }

  useEffect(() => {
    UserService.getMany({ search }, { page, items: 25 }).then((response) => {
      setMeta(response.meta);
      setUsers(response.data);
    });
  }, [page]);

  return (
    <SafeAreaView>
      <View className="flex flex-1 gap-4 lg:px-16 px-4 py-4 min-h-[100dvh] bg-background-100">
        <BoxHeader title="Find Users" className="!pb-0" />

        <View className="flex flex-row items-center">
          <Input
            squareRight
            label="Search"
            placeholder="Search for a user"
            onChange={setSearch}
          />

          <Button
            size="sm"
            squareLeft
            icon={faSearch}
            className="self-end"
            onClick={searchUsers}
          />
        </View>

        <Table
          data={users}
          loading={loading}
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
                title: "Favorites",
                row: (user) => <Text>{user.deckFavorites}</Text>,
              },
              {
                title: "Views",
                row: (user) => <Text>{user.deckViews}</Text>,
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

      <Footer />
    </SafeAreaView>
  );
}
