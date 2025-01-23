import CardSearch from "@/components/cards/card-search";
import Box from "@/components/ui/box/box";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Dropdown from "@/components/ui/dropdown/dropdown";
import Table, { TableColumn } from "@/components/ui/table/table";
import Text from "@/components/ui/text/text";
import { MTGSetType, MTGSetTypes } from "@/constants/mtg/mtg-set-types";
import { titleCase } from "@/functions/text-manipulation";
import ScryfallService from "@/hooks/services/scryfall.service";
import { faCheck, faFilter } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Image, ScrollView, View } from "react-native";
import { Set } from "../../models/card/set";

export default function CardsPage() {
  const [loading, setLoading] = React.useState(false);

  const [sets, setSets] = React.useState([] as Set[]);
  const [filteredSets, setFilteredSets] = React.useState([] as Set[]);
  const [selectedSets, setSelectedSets] = React.useState([] as MTGSetType[]);

  useEffect(() => {
    ScryfallService.getSets().then((sets) =>
      setSets(sets.filter((set) => set.code.length === 3))
    );
  }, []);

  useEffect(() => {
    if (!selectedSets?.length) setFilteredSets(sets);
    else {
      setFilteredSets(sets.filter((set) => selectedSets.includes(set.setType)));
    }
  }, [sets, selectedSets]);

  function importAllCards() {
    setLoading(true);
    ScryfallService.getAllCards().then(() => setLoading(false));
  }

  return (
    <ScrollView>
      <View className="flex flex-1 gap-4 lg:px-16 px-4 py-8 min-h-[100vh] bg-background-100">
        <BoxHeader
          title="Find Cards"
          subtitle="Search for cards or view full sets"
          className="!pb-0"
          end={
            <Button
              text={loading ? "Loading" : "Import All Cards"}
              onClick={importAllCards}
              disabled={loading}
            />
          }
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
        </View>
      </View>
    </ScrollView>
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
