import CardSearch from "@/components/cards/card-search";
import Text from "@/components/ui/text/text";
import React from "react";
import { View } from "react-native";

export default function Cards() {
  // const [search, setSearch] = React.useState("");

  // function searchCards(search?: string) {
  //   console.log(search);
  // }

  return (
    <View className="flex flex-1 gap-4 px-11 py-8 bg-background-100">
      <View className="flex">
        <Text size="xl" thickness="medium">
          Find Cards
        </Text>
        <Text>Search for cards or view full sets</Text>
      </View>

      {/* <SearchBar
        search={search}
        searchChange={setSearch}
        searchAction={searchCards}
      /> */}

      <CardSearch />
    </View>
  );
}
