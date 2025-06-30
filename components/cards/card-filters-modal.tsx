import Button from "@/components/ui/button/button";
import Divider from "@/components/ui/divider/divider";
import ColorFilter from "@/components/ui/filters/filter-types/color-filter";
import RarityFilter from "@/components/ui/filters/filter-types/rarity-filter";
import TypeFilter from "@/components/ui/filters/filter-types/type-filter";
import Modal from "@/components/ui/modal/modal";
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
import { faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { View } from "react-native";
import SortingFilter from "../ui/filters/sorting-filter";

export interface CardFiltersModalProps {
  type?: CardFilterSortType;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;

  filters?: CardFilters;
  setFilters?: Dispatch<SetStateAction<CardFilters>>;
}

export default function CardFiltersModal({
  type = "cost",
  open,
  setOpen,
  filters,
  setFilters,
}: CardFiltersModalProps) {
  const router = useRouter();

  const { ...rawParams } = useLocalSearchParams();

  const { setPreferences } = useContext(BuilderPreferencesContext);

  const [cardFilters, setCardFilters] = useState(
    filters || getLocalStorageBuilderPreferences()?.filters || {}
  );
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
    const paramFilters = queryParamsToFilters(
      rawParams as Record<string, string>
    );

    if (paramFilters.colorFilter?.length) {
      setColorFilter(paramFilters.colorFilter);
    }
    if (paramFilters.typeFilter?.length) {
      setTypeFilter(paramFilters.typeFilter);
    }
    if (paramFilters.rarityFilter?.length) {
      setRarityFilter(paramFilters.rarityFilter);
    }
    if (paramFilters.priceSort) {
      setPriceSort(paramFilters.priceSort);
    }
    if (paramFilters.manaValueSort) {
      setManaValueSort(paramFilters.manaValueSort);
    }
    if (paramFilters.alphabeticalSort) {
      setAlphabeticalSort(paramFilters.alphabeticalSort);
    }

    applyFilters(paramFilters);
  }, []);

  useEffect(() => {
    const filters: CardFilters = {
      colorFilter,
      typeFilter,
      rarityFilter,
      priceSort,
      manaValueSort,
      alphabeticalSort,
    };
    setCardFilters(filters);

    const filterLength =
      (colorFilter?.length || 0) +
      (typeFilter?.length || 0) +
      (rarityFilter?.length || 0) +
      (priceSort ? 1 : 0) +
      (manaValueSort ? 1 : 0) +
      (alphabeticalSort ? 1 : 0);
    setFilterLength(filterLength);
  }, [
    colorFilter,
    typeFilter,
    rarityFilter,
    manaValueSort,
    priceSort,
    alphabeticalSort,
  ]);

  function applyFilters(givenFilters?: CardFilters) {
    setOpen(false);

    if (filters ?? givenFilters) {
      setFilters?.(givenFilters ?? cardFilters);
      router.setParams(filtersToQueryParams(givenFilters ?? cardFilters));
    } else {
      setLocalStorageBuilderPreferences({ filters: cardFilters });
      setPreferences(getLocalStorageBuilderPreferences() || {});
    }
  }

  function clearFilters() {
    setOpen(false);
    setColorFilter([]);
    setTypeFilter([]);
    setRarityFilter([]);
    setManaValueSort(null);
    setPriceSort(null);
    setResetFilters(!resetFilters);

    if (filters) {
      setFilters?.({
        colorFilter: [],
        typeFilter: [],
        rarityFilter: [],
      });
      router.replace(`/cards/${rawParams.setId}`);
    } else {
      setLocalStorageBuilderPreferences({
        filters: { colorFilter: [], typeFilter: [], rarityFilter: [] },
      });
      setPreferences(getLocalStorageBuilderPreferences() || {});
    }
  }

  function filtersToQueryParams(filters: CardFilters) {
    const params: Record<string, string> = {};

    if (filters.colorFilter?.length)
      params.color = filters.colorFilter.join(",");
    if (filters.typeFilter?.length) params.type = filters.typeFilter.join(",");
    if (filters.rarityFilter?.length)
      params.rarity = filters.rarityFilter.join(",");

    if (filters.priceSort) params.priceSort = filters.priceSort;
    if (filters.manaValueSort) params.manaSort = filters.manaValueSort;
    if (filters.alphabeticalSort) params.alphaSort = filters.alphabeticalSort;

    return params;
  }

  function queryParamsToFilters(params: Record<string, string>): CardFilters {
    return {
      colorFilter: (params.color?.split(",") ?? []) as MTGColor[],
      typeFilter: (params.type?.split(",") ?? []) as MTGCardType[],
      rarityFilter: (params.rarity?.split(",") ?? []) as MTGRarity[],
      priceSort: (params.priceSort as SortType) || null,
      manaValueSort: (params.manaSort as SortType) || null,
      alphabeticalSort: (params.alphaSort as SortType) || null,
    };
  }

  return (
    <Modal
      open={open}
      icon={faFilter}
      setOpen={setOpen}
      title="Set Filters"
      footer={
        <View className="flex-1 flex flex-row justify-end gap-2">
          <Button
            rounded
            size="sm"
            text="Clear"
            type="outlined"
            action="danger"
            className="flex-1"
            icon={faTimes}
            disabled={!filterLength}
            onClick={clearFilters}
          />

          <Button
            rounded
            size="sm"
            text="Filter"
            type="outlined"
            className="flex-1"
            icon={faFilter}
            disabled={!filterLength}
            onClick={applyFilters}
          />
        </View>
      }
    >
      <View className="flex gap-2">
        <View className="flex gap-4">
          {type !== "color" && (
            <View className="flex gap-2 max-w-96">
              <Text size="md" weight="bold">
                Colors to Include
              </Text>

              <Divider thick />

              <ColorFilter
                flat
                colorFilters={colorFilter}
                setColorFilters={setColorFilter}
              />
            </View>
          )}

          {type !== "type" && (
            <View className="flex gap-2 max-w-96">
              <Text size="md" weight="bold">
                Types to Filter By
              </Text>

              <Divider thick />

              <TypeFilter
                flat
                typeFilters={typeFilter}
                setTypeFilters={setTypeFilter}
              />
            </View>
          )}

          {type !== "rarity" && (
            <View className="flex gap-2 max-w-96">
              <Text size="md" weight="bold">
                Rarities to Filter By
              </Text>

              <Divider thick />

              <RarityFilter
                flat
                rarityFilters={rarityFilter}
                setRarityFilters={setRarityFilter}
              />
            </View>
          )}

          <View className="flex gap-2 max-w-96">
            <Text size="md" weight="bold">
              Sorting
            </Text>

            <Divider thick />

            <View className="flex flex-row gap-2">
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
          </View>
        </View>
      </View>
    </Modal>
  );
}
