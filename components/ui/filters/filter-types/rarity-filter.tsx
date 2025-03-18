import Chip from "@/components/ui/chip/chip";
import Dropdown from "@/components/ui/dropdown/dropdown";
import Text from "@/components/ui/text/text";
import { MTGRarities, MTGRarity } from "@/constants/mtg/mtg-rarity";
import BuilderPreferencesContext from "@/contexts/cards/builder-preferences.context";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";

export interface RarityFilterProps {
  flat?: boolean;
  reset?: boolean;
  disabled?: boolean;
  rarityFilters?: MTGRarity[];
  setRarityFilters: React.Dispatch<
    React.SetStateAction<MTGRarity[] | undefined>
  >;
}

export default function RarityFilter({
  flat,
  reset,
  disabled,
  rarityFilters,
  setRarityFilters,
}: RarityFilterProps) {
  const { preferences } = useContext(BuilderPreferencesContext);

  const [expanded, setExpanded] = React.useState(false);

  const [commonApplied, setCommonApplied] = React.useState(false);
  const [uncommonApplied, setUncommonApplied] = React.useState(false);
  const [rareApplied, setRareApplied] = React.useState(false);
  const [mythicApplied, setMythicApplied] = React.useState(false);

  const [appliedFilters, setAppliedFilters] = React.useState([] as MTGRarity[]);

  useEffect(() => {
    setAppliedFilters([
      ...(commonApplied ? [MTGRarities.COMMON] : []),
      ...(uncommonApplied ? [MTGRarities.UNCOMMON] : []),
      ...(rareApplied ? [MTGRarities.RARE] : []),
      ...(mythicApplied ? [MTGRarities.MYTHIC] : []),
    ] as MTGRarity[]);
  }, [commonApplied, uncommonApplied, rareApplied, mythicApplied]);

  useEffect(() => setRarityFilters(appliedFilters), [appliedFilters]);

  useEffect(() => {
    setCommonApplied(false);
    setUncommonApplied(false);
    setRareApplied(false);
    setMythicApplied(false);
    setAppliedFilters([]);
  }, [reset]);

  useEffect(() => {
    if (rarityFilters?.length) {
      if (rarityFilters.includes(MTGRarities.COMMON)) setCommonApplied(true);
      if (rarityFilters.includes(MTGRarities.UNCOMMON)) {
        setUncommonApplied(true);
      }
      if (rarityFilters.includes(MTGRarities.RARE)) setRareApplied(true);
      if (rarityFilters.includes(MTGRarities.MYTHIC)) setMythicApplied(true);
    } else {
      if (!preferences.filters) return;

      if (preferences.filters.rarityFilter?.includes(MTGRarities.COMMON)) {
        setCommonApplied(true);
      }
      if (preferences.filters.rarityFilter?.includes(MTGRarities.UNCOMMON)) {
        setUncommonApplied(true);
      }
      if (preferences.filters.rarityFilter?.includes(MTGRarities.RARE)) {
        setRareApplied(true);
      }
      if (preferences.filters.rarityFilter?.includes(MTGRarities.MYTHIC)) {
        setMythicApplied(true);
      }
    }
  }, [preferences, rarityFilters]);

  const rarityFiltersList = (
    <View className="flex flex-row flex-wrap gap-2">
      <Chip
        text="Common"
        disabled={disabled}
        type={commonApplied ? "default" : "outlined"}
        onClick={() => setCommonApplied(!commonApplied)}
      />

      <Chip
        text="Uncommon"
        disabled={disabled}
        type={uncommonApplied ? "default" : "outlined"}
        onClick={() => setUncommonApplied(!uncommonApplied)}
      />

      <Chip
        text="Rare"
        disabled={disabled}
        type={rareApplied ? "default" : "outlined"}
        onClick={() => setRareApplied(!rareApplied)}
      />

      <Chip
        text="Mythic"
        disabled={disabled}
        type={mythicApplied ? "default" : "outlined"}
        onClick={() => setMythicApplied(!mythicApplied)}
      />
    </View>
  );

  if (flat) return rarityFiltersList;

  return (
    <View>
      <Chip
        type="outlined"
        text="Rarity"
        onClick={() => setExpanded(!expanded)}
      >
        <View
          className={`overflow-hidden transition-all duration-300 ${
            appliedFilters.length ? "ml-0 max-w-[100px]" : "-ml-2 max-w-[0px]"
          }`}
        >
          <Text
            weight="semi"
            className={`!text-dark-100 rounded-full px-[9px] py-[3px] bg-primary-200`}
          >
            {appliedFilters.length}
          </Text>
        </View>
      </Chip>

      <Dropdown
        expanded={expanded}
        setExpanded={setExpanded}
        className={`!max-w-[360px] px-4 py-2 border-2 border-primary-300 bg-background-100 rounded-2xl shadow-lg`}
      >
        {rarityFiltersList}
      </Dropdown>
    </View>
  );
}
