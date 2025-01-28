import CardSearch from "@/components/cards/card-search";
import Box from "@/components/ui/box/box";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Dropdown from "@/components/ui/dropdown/dropdown";
import Pagination from "@/components/ui/pagination/pagination";
import Table, { TableColumn } from "@/components/ui/table/table";
import Text from "@/components/ui/text/text";
import { MTGSetType, MTGSetTypes } from "@/constants/mtg/mtg-set-types";
import BodyHeightContext from "@/contexts/ui/body-height.context";
import LoadingContext from "@/contexts/ui/loading.context";
import { titleCase } from "@/functions/text-manipulation";
import { PaginationMeta } from "@/hooks/pagination";
import ScryfallService from "@/hooks/services/scryfall.service";
import { faCheck, faFilter } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import React, { useContext, useEffect, useRef } from "react";
import { Image, SafeAreaView, View } from "react-native";
import { Set } from "../../models/card/set";

export default function CardsPage() {
  const { setLoading } = useContext(LoadingContext);
  const { setBodyHeight } = useContext(BodyHeightContext);

  const containerRef = useRef<SafeAreaView>(null);

  const [allCardsLoading, setAllCardsLoading] = React.useState(false);

  const [page, setPage] = React.useState(1);
  const [items, setItems] = React.useState(25);
  const [meta, setMeta] = React.useState({
    page,
    items,
    totalItems: 0,
    totalPages: 0,
  } as PaginationMeta);

  const [sets, setSets] = React.useState([] as Set[]);
  const [filteredSets, setFilteredSets] = React.useState([] as Set[]);
  const [selectedSets, setSelectedSets] = React.useState([] as MTGSetType[]);

  useEffect(() => {
    setLoading(true);

    ScryfallService.getSets().then((sets) => {
      setSets(sets.filter((set) => set.code.length === 3));
      setLoading(false);
    });
  }, []);

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
    setAllCardsLoading(true);
    ScryfallService.getAllCards().then(() => setAllCardsLoading(false));
  }

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
        <BoxHeader
          title="Find Cards"
          subtitle="Search for cards or view full sets"
          className="!pb-0"
          // end={
          //   <Button
          //     text={loading ? "Loading" : "Import All Cards"}
          //     onClick={importAllCards}
          //     disabled={loading}
          //   />
          // }
        />

        <CardSearch hideCardPreview linkToCardPage />

        <View className="flex z-[-1]">
          <Table
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
    </SafeAreaView>
  );
}

interface SetFilterProps {
  selectedSets: MTGSetType[];
  setSelectedSets: React.Dispatch<React.SetStateAction<MTGSetType[]>>;
}

function SetFilter({ selectedSets, setSelectedSets }: SetFilterProps) {
  const [selectSetsOpen, setSelectSetsOpen] = React.useState(false);

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
        <Dropdown
          xOffset={-124}
          expanded={selectSetsOpen}
          setExpanded={setSelectSetsOpen}
        >
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
