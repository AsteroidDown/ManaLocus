import Box from "@/components/ui/box/box";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Dropdown from "@/components/ui/dropdown/dropdown";
import Footer from "@/components/ui/navigation/footer";
import Pagination from "@/components/ui/pagination/pagination";
import SearchBar from "@/components/ui/search-bar/search-bar";
import Table, { TableColumn } from "@/components/ui/table/table";
import Text from "@/components/ui/text/text";
import { MTGSetType, MTGSetTypes } from "@/constants/mtg/mtg-set-types";
import { titleCase } from "@/functions/text-manipulation";
import { PaginationMeta } from "@/hooks/pagination";
import ScryfallService from "@/hooks/services/scryfall.service";
import { faCheck, faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Image, SafeAreaView, View } from "react-native";
import { Set } from "../../models/card/set";

export default function CardsPage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [items, setItems] = useState(25);
  const [meta, setMeta] = useState({
    page,
    items,
    totalItems: 0,
    totalPages: 0,
  } as PaginationMeta);

  const [sets, setSets] = useState([] as Set[]);
  const [filteredSets, setFilteredSets] = useState([] as Set[]);
  const [selectedSets, setSelectedSets] = useState([] as MTGSetType[]);

  useEffect(() => {
    if (sets?.length) return;

    setLoading(true);

    ScryfallService.getSets().then((sets) => {
      setSets(sets.filter((set) => set.code.length === 3));
      setLoading(false);
    });
  }, [sets]);

  useEffect(() => {
    const setsToView: Set[] = [];
    if (!selectedSets?.length) {
      sets
        .slice((page - 1) * items, page * items)
        .forEach((set) => setsToView.push(set));
    } else {
      sets
        .filter((set) => selectedSets.includes(set.setType))
        .slice((page - 1) * items, page * items)
        .forEach((set) => setsToView.push(set));
    }

    setFilteredSets(setsToView);
    setMeta({
      page,
      items,
      totalItems: sets.length,
      totalPages: Math.ceil(sets.length / items),
    });
  }, [sets, selectedSets, page, sets]);

  function importAllCards() {
    ScryfallService.getAllCards();
  }

  return (
    <SafeAreaView>
      <View className="flex flex-1 gap-4 lg:px-16 px-4 py-4 min-h-[100dvh] bg-background-100">
        <BoxHeader
          startIcon={faSearch}
          title="Find Cards"
          subtitle="Search for cards or view full sets"
          className="!pb-0"
          // end={<Button text={"Import All Cards"} onClick={importAllCards} />}
        />

        <SearchBar
          search={search}
          searchChange={setSearch}
          searchAction={() => router.push(`cards/search?query=${search}`)}
        />

        <View className="flex z-[-1]">
          <Table
            loading={loading}
            data={filteredSets}
            rowClick={(set) => router.push(`cards/${set.code}`)}
            columns={
              [
                {
                  fit: true,
                  row: (set) => (
                    <Image
                      source={{ uri: set.iconSvgUri }}
                      style={[{ resizeMode: "contain" }]}
                      className="h-6 w-6 fill-white invert-[1]"
                    />
                  ),
                },
                {
                  title: "Name",
                  row: (set) => <Text>{set.name}</Text>,
                },
                {
                  fit: true,
                  title: "Code",
                  row: (set) => <Text>{set.code.toUpperCase()}</Text>,
                },
                {
                  fit: true,
                  title: "Type",
                  row: (set) => <Text>{titleCase(set.setType)}</Text>,
                  titleEnd: (
                    <SetFilter
                      selectedSets={selectedSets}
                      setSelectedSets={setSelectedSets}
                    />
                  ),
                },
                {
                  fit: true,
                  title: "Card Count",
                  row: (set) => <Text>{set.cardCount}</Text>,
                },
                {
                  fit: true,
                  title: "Released",
                  row: (set) => <Text>{set.releasedAt}</Text>,
                },
              ] as TableColumn<Set>[]
            }
          />

          <Pagination meta={meta} onChange={(page) => setPage(page)} />
        </View>
      </View>

      <Footer />
    </SafeAreaView>
  );
}

interface SetFilterProps {
  selectedSets: MTGSetType[];
  setSelectedSets: Dispatch<SetStateAction<MTGSetType[]>>;
}

function SetFilter({ selectedSets, setSelectedSets }: SetFilterProps) {
  const [selectSetsOpen, setSelectSetsOpen] = useState(false);

  const setTypes = Object.values(MTGSetTypes);

  function toggleSetType(setType: MTGSetType) {
    if (selectedSets.includes(setType)) {
      selectedSets.splice(selectedSets.indexOf(setType), 1);
    } else {
      selectedSets.push(setType);
    }

    setSelectedSets([...selectedSets]);
  }

  return (
    <View>
      <Button
        rounded
        icon={faFilter}
        type="clear"
        action="default"
        onClick={() => setSelectSetsOpen(true)}
      ></Button>

      <View className="-mx-2">
        <Dropdown expanded={selectSetsOpen} setExpanded={setSelectSetsOpen}>
          <Box className="flex justify-start items-start !p-0 border-2 border-primary-300 !bg-background-100 !bg-opacity-95 overflow-auto max-h-[250px]">
            {setTypes.map((setType, index) => (
              <Button
                start
                square
                iconRight
                type="clear"
                className="w-full"
                key={setType + index}
                icon={selectedSets.includes(setType) ? faCheck : undefined}
                text={titleCase(setType.replace("_", " "))}
                onClick={() => toggleSetType(setType)}
              />
            ))}
          </Box>
        </Dropdown>
      </View>
    </View>
  );
}
