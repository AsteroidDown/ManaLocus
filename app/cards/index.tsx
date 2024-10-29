import Text from "@/components/ui/text/text";
import ScryfallService from "@/hooks/scryfall.service";
import { Link } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Set } from "../../models/card/set";

export default function CardsPage() {
  // const [search, setSearch] = React.useState("");

  // function searchCards(search?: string) {
  //   console.log(search);
  // }

  const [sets, setSets] = React.useState([] as Set[]);

  useEffect(() => {
    ScryfallService.getSets().then((sets) =>
      setSets(sets.filter((set) => set.code.length === 3))
    );
  }, []);

  return (
    <ScrollView>
      <View className="flex flex-1 gap-4 px-11 py-8 min-h-[100vh] bg-background-100">
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

        {/* <CardSearch /> */}

        <View className="flex">
          {sets.map((set, index) => (
            <Link
              key={set.id + index}
              href={`cards/set/${set.code}`}
              className="px-4 py-2 border-t border-dark-200"
            >
              <Text>{set.name}</Text>
            </Link>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
