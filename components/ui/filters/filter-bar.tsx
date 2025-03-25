import Button from "@/components/ui/button/button";
import Text from "@/components/ui/text/text";
import { MTGColor } from "@/constants/mtg/mtg-colors";
import { MTGRarity } from "@/constants/mtg/mtg-rarity";
import { MTGCardType } from "@/constants/mtg/mtg-types";
import { SortType } from "@/constants/sorting";
import BuilderPreferencesContext from "@/contexts/cards/builder-preferences.context";
import {
  getLocalStorageBuilderPreferences,
  setLocalStorageBuilderPreferences,
} from "@/functions/local-storage/builder-preferences-local-storage";
import {
  CardFilters,
  CardFilterSortType,
} from "@/models/sorted-cards/sorted-cards";
import { faFilter, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useWindowDimensions, View } from "react-native";
import Chip from "../chip/chip";
import ColorFilter from "./filter-types/color-filter";
import RarityFilter from "./filter-types/rarity-filter";
import TypeFilter from "./filter-types/type-filter";
import SortingFilter from "./sorting-filter";

export interface FilterBarProps {
  type?: CardFilterSortType;
  setFilters: Dispatch<SetStateAction<CardFilters>>;
}

export default function FilterBar({ type, setFilters }: FilterBarProps) {
  const width = useWindowDimensions().width;

  const { setPreferences } = useContext(BuilderPreferencesContext);

  const [showFilters, setShowFilters] = useState(false);
  const [filterLength, setFilterLength] = useState(0);
  const [resetFilters, setResetFilters] = useState(false);

  const [colorFilter, setColorFilter] = useState(
    undefined as MTGColor[] | undefined
  );
  const [typeFilter, setTypeFilter] = useState(
    undefined as MTGCardType[] | undefined
  );
  const [rarityFilter, setRarityFilter] = useState(
    undefined as MTGRarity[] | undefined
  );

  const [priceSort, setPriceSort] = useState(null as SortType);
  const [manaValueSort, setManaValueSort] = useState(null as SortType);
  const [alphabeticalSort, setAlphabeticalSort] = useState(null as SortType);

  useEffect(() => {
    const filters: CardFilters = {
      colorFilter,
      typeFilter,
      rarityFilter,
      priceSort,
      manaValueSort,
      alphabeticalSort,
    };
    setFilters(filters);

    const filterLength =
      (colorFilter?.length || 0) +
      (typeFilter?.length || 0) +
      (rarityFilter?.length || 0);
    setFilterLength(filterLength);

    if (filterLength) {
      setLocalStorageBuilderPreferences({ filters });
      setPreferences(getLocalStorageBuilderPreferences() || {});
    }
  }, [
    colorFilter,
    typeFilter,
    rarityFilter,
    manaValueSort,
    priceSort,
    alphabeticalSort,
  ]);

  function clearFilters() {
    setColorFilter([]);
    setTypeFilter([]);
    setRarityFilter([]);
    setManaValueSort(null);
    setPriceSort(null);
    setResetFilters(!resetFilters);
    setLocalStorageBuilderPreferences({
      filters: { colorFilter: [], typeFilter: [], rarityFilter: [] },
    });
    setPreferences(getLocalStorageBuilderPreferences() || {});
  }

  return (
    <View
      className={`flex-1 flex flex-row-reverse transition-all duration-300 ${
        width > 600 ? (showFilters ? "max-w-[1000px]" : "max-w-[8px]") : ""
      }`}
    >
      <View
        className={`flex-1 flex flex-row items-center rounded-l-full z-10 bg-background-100 max-h-8`}
      >
        <Button
          rounded
          size="sm"
          icon={faFilter}
          type={showFilters ? "default" : "clear"}
          onClick={() => setShowFilters(!showFilters)}
        />

        <View
          className={`${
            filterLength ? "max-w-[100px]" : "max-w-[0px]"
          } absolute -bottom-1.5 -right-1.5 overflow-hidden transition-all duration-300`}
        >
          <Text
            weight="bold"
            className={`!text-dark-100 bg-primary-200 py-px px-[7px] rounded-full`}
          >
            {filterLength}
          </Text>
        </View>
      </View>

      {width > 600 && (
        <View
          className={`flex flex-row gap-2 w-fit rounded-full overflow-hidden transition-all duration-300 ${
            showFilters
              ? "mr-4 max-w-[100%] overflow-x-auto"
              : "-mr-8 max-w-[0%]"
          }`}
        >
          {filterLength > 0 && (
            <Chip
              size="sm"
              type="outlined"
              startIcon={faRotateRight}
              onClick={() => clearFilters()}
            />
          )}

          {type !== "color" && (
            <ColorFilter
              setColorFilters={setColorFilter}
              reset={resetFilters}
            />
          )}

          {type !== "type" && (
            <TypeFilter setTypeFilters={setTypeFilter} reset={resetFilters} />
          )}

          <RarityFilter
            setRarityFilters={setRarityFilter}
            reset={resetFilters}
          />

          {type !== "cost" && (
            <SortingFilter
              title="Mana Value"
              reset={resetFilters}
              sortDirection={manaValueSort}
              setSortDirection={setManaValueSort}
            />
          )}

          <SortingFilter
            title="Price"
            reset={resetFilters}
            sortDirection={priceSort}
            setSortDirection={setPriceSort}
          />

          <SortingFilter
            title="Name"
            reset={resetFilters}
            sortDirection={alphabeticalSort}
            setSortDirection={setAlphabeticalSort}
          />
        </View>
      )}
    </View>
  );
}
