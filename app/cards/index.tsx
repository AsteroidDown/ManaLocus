import CardSearch from "@/components/cards/card-search";
import Box from "@/components/ui/box/box";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Dropdown from "@/components/ui/dropdown/dropdown";
import Text from "@/components/ui/text/text";
import { MTGSetType, MTGSetTypes } from "@/constants/mtg/mtg-set-types";
import { titleCase } from "@/functions/text-manipulation";
import ScryfallService from "@/hooks/services/scryfall.service";
import { faCheck, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "expo-router";
import React, { useEffect } from "react";
import { Image, ScrollView, View } from "react-native";
import { Set } from "../../models/card/set";

export default function CardsPage() {
  const [selectSetsOpen, setSelectSetsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [sets, setSets] = React.useState([] as Set[]);
  const [filteredSets, setFilteredSets] = React.useState([] as Set[]);
  const [selectedSets, setSelectedSets] = React.useState([] as MTGSetType[]);

  const setTypes = Object.values(MTGSetTypes);

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

  function toggleSetType(setType: MTGSetType) {
    if (selectedSets.includes(setType)) {
      selectedSets.splice(selectedSets.indexOf(setType), 1);
    } else {
      selectedSets.push(setType);
    }

    setSelectedSets([...selectedSets]);
  }

  function importAllCards() {
    setLoading(true);
    ScryfallService.getAllCards().then((cards) => {
      console.log(cards);
      setLoading(false);
    });
  }

  return (
    <ScrollView>
      <View className="flex flex-1 gap-4 px-11 py-8 min-h-[100vh] bg-background-100">
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
          <View className="sticky top-0 flex flex-row gap-2 items-center px-4 py-2 border-b border-dark-200 bg-background-100 z-10">
            <View className="flex flex-row items-center gap-4">
              <View className="w-6" />

              <Text thickness="bold">Set Name</Text>
            </View>

            <View className="flex flex-row gap-4 items-center ml-auto">
              <Text thickness="bold" className="text-dark-600 w-10">
                Code
              </Text>

              <View className="flex flex-row justify-between items-center w-32 max-h-8">
                <Text thickness="bold" className="text-dark-600">
                  Set Type
                </Text>

                <Button
                  rounded
                  type="clear"
                  action="default"
                  onClick={() => setSelectSetsOpen(true)}
                >
                  <FontAwesomeIcon icon={faFilter} className="color-white" />
                </Button>

                <View className="-mx-2">
                  <Dropdown
                    xOffset={-180}
                    expanded={selectSetsOpen}
                    setExpanded={setSelectSetsOpen}
                  >
                    <Box className="flex justify-start items-start !p-0 mt-4 border-2 border-primary-300 !bg-background-100 !bg-opacity-90 overflow-auto max-h-[250px]">
                      {setTypes.map((setType, index) => (
                        <Button
                          start
                          square
                          iconRight
                          type="clear"
                          className="w-full"
                          key={setType + index}
                          icon={
                            selectedSets.includes(setType) ? faCheck : undefined
                          }
                          text={titleCase(setType.replace("_", " "))}
                          onClick={() => toggleSetType(setType)}
                        />
                      ))}
                    </Box>
                  </Dropdown>
                </View>
              </View>

              <Text thickness="bold" className="text-dark-600 w-24">
                Card Count
              </Text>

              <Text thickness="bold" className="text-dark-600 w-[84px]">
                Release
              </Text>
            </View>
          </View>

          {filteredSets.map((set, index) => (
            <Link key={set.id + index} href={`cards/${set.code}`}>
              <View className="flex flex-row gap-2 items-center px-4 py-2 border-b border-dark-200 hover:bg-background-200 transition-all">
                <View className="flex flex-row items-center gap-4">
                  <Image
                    source={{ uri: set.iconSvgUri }}
                    className="h-6 w-6 fill-white invert-[1]"
                  />

                  <Text>{set.name}</Text>
                </View>

                <View className="flex flex-row gap-4 items-center ml-auto">
                  <Text className="text-dark-600 w-10">
                    {set.code.toUpperCase()}
                  </Text>

                  <Text className="text-dark-600 w-32">
                    {titleCase(set.setType.replace("_", " "))}
                  </Text>

                  <Text className="text-dark-600 w-24">{set.cardCount}</Text>

                  <Text className="text-dark-600 w-[84px]">
                    {set.releasedAt}
                  </Text>
                </View>
              </View>
            </Link>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
