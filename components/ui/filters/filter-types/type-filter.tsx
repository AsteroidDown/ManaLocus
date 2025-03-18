import Chip from "@/components/ui/chip/chip";
import Dropdown from "@/components/ui/dropdown/dropdown";
import Text from "@/components/ui/text/text";
import { MTGCardType, MTGCardTypes } from "@/constants/mtg/mtg-types";
import BuilderPreferencesContext from "@/contexts/cards/builder-preferences.context";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";

export interface TypeFilterProps {
  flat?: boolean;
  reset?: boolean;
  disabled?: boolean;
  typeFilters?: MTGCardType[];
  setTypeFilters: React.Dispatch<
    React.SetStateAction<MTGCardType[] | undefined>
  >;
}

export default function TypeFilter({
  flat,
  reset,
  disabled,
  typeFilters,
  setTypeFilters,
}: TypeFilterProps) {
  const { preferences } = useContext(BuilderPreferencesContext);

  const [expanded, setExpanded] = React.useState(false);

  const [creatureApplied, setCreatureApplied] = React.useState(false);
  const [instantApplied, setInstantApplied] = React.useState(false);
  const [sorceryApplied, setSorceryApplied] = React.useState(false);
  const [artifactApplied, setArtifactApplied] = React.useState(false);
  const [enchantmentApplied, setEnchantmentApplied] = React.useState(false);
  const [planeswalkerApplied, setPlaneswalkerApplied] = React.useState(false);
  const [battleApplied, setBattleApplied] = React.useState(false);
  const [landApplied, setLandApplied] = React.useState(false);

  const [appliedFilters, setAppliedFilters] = React.useState(
    [] as MTGCardType[]
  );

  useEffect(() => {
    setAppliedFilters([
      ...(creatureApplied ? [MTGCardTypes.CREATURE] : []),
      ...(instantApplied ? [MTGCardTypes.INSTANT] : []),
      ...(sorceryApplied ? [MTGCardTypes.SORCERY] : []),
      ...(artifactApplied ? [MTGCardTypes.ARTIFACT] : []),
      ...(enchantmentApplied ? [MTGCardTypes.ENCHANTMENT] : []),
      ...(landApplied ? [MTGCardTypes.LAND] : []),
      ...(planeswalkerApplied ? [MTGCardTypes.PLANESWALKER] : []),
      ...(battleApplied ? [MTGCardTypes.BATTLE] : []),
    ] as MTGCardType[]);
  }, [
    creatureApplied,
    instantApplied,
    sorceryApplied,
    artifactApplied,
    enchantmentApplied,
    landApplied,
    planeswalkerApplied,
    battleApplied,
  ]);

  useEffect(() => setTypeFilters(appliedFilters), [appliedFilters]);

  useEffect(() => {
    setCreatureApplied(false);
    setInstantApplied(false);
    setSorceryApplied(false);
    setArtifactApplied(false);
    setEnchantmentApplied(false);
    setLandApplied(false);
    setPlaneswalkerApplied(false);
    setBattleApplied(false);
    setAppliedFilters([]);
  }, [reset]);

  useEffect(() => {
    if (typeFilters?.length) {
      if (typeFilters.includes(MTGCardTypes.CREATURE)) {
        setCreatureApplied(true);
      }
      if (typeFilters.includes(MTGCardTypes.INSTANT)) {
        setInstantApplied(true);
      }
      if (typeFilters.includes(MTGCardTypes.SORCERY)) {
        setSorceryApplied(true);
      }
      if (typeFilters.includes(MTGCardTypes.ARTIFACT)) {
        setArtifactApplied(true);
      }
      if (typeFilters.includes(MTGCardTypes.ENCHANTMENT)) {
        setEnchantmentApplied(true);
      }
      if (typeFilters.includes(MTGCardTypes.LAND)) {
        setLandApplied(true);
      }
      if (typeFilters.includes(MTGCardTypes.PLANESWALKER)) {
        setPlaneswalkerApplied(true);
      }
      if (typeFilters.includes(MTGCardTypes.BATTLE)) {
        setBattleApplied(true);
      }
    } else {
      if (!preferences.filters) return;
      const typeFilter = preferences.filters.typeFilter;

      if (typeFilter?.includes(MTGCardTypes.CREATURE)) {
        setCreatureApplied(true);
      }
      if (typeFilter?.includes(MTGCardTypes.INSTANT)) {
        setInstantApplied(true);
      }
      if (typeFilter?.includes(MTGCardTypes.SORCERY)) {
        setSorceryApplied(true);
      }
      if (typeFilter?.includes(MTGCardTypes.ARTIFACT)) {
        setArtifactApplied(true);
      }
      if (typeFilter?.includes(MTGCardTypes.ENCHANTMENT)) {
        setEnchantmentApplied(true);
      }
      if (typeFilter?.includes(MTGCardTypes.LAND)) {
        setLandApplied(true);
      }
      if (typeFilter?.includes(MTGCardTypes.PLANESWALKER)) {
        setPlaneswalkerApplied(true);
      }
      if (typeFilter?.includes(MTGCardTypes.BATTLE)) {
        setBattleApplied(true);
      }
    }
  }, [preferences, typeFilters]);

  const typeFiltersList = (
    <View className="flex flex-row flex-wrap gap-2">
      <Chip
        text="Creature"
        disabled={disabled}
        type={creatureApplied ? "default" : "outlined"}
        onClick={() => setCreatureApplied(!creatureApplied)}
      />

      <Chip
        text="Instant"
        disabled={disabled}
        type={instantApplied ? "default" : "outlined"}
        onClick={() => setInstantApplied(!instantApplied)}
      />

      <Chip
        text="Sorcery"
        disabled={disabled}
        type={sorceryApplied ? "default" : "outlined"}
        onClick={() => setSorceryApplied(!sorceryApplied)}
      />

      <Chip
        text="Artifact"
        disabled={disabled}
        type={artifactApplied ? "default" : "outlined"}
        onClick={() => setArtifactApplied(!artifactApplied)}
      />

      <Chip
        text="Enchantment"
        disabled={disabled}
        type={enchantmentApplied ? "default" : "outlined"}
        onClick={() => setEnchantmentApplied(!enchantmentApplied)}
      />

      <Chip
        text="Land"
        disabled={disabled}
        type={landApplied ? "default" : "outlined"}
        onClick={() => setLandApplied(!landApplied)}
      />

      <Chip
        text="Planeswalker"
        disabled={disabled}
        type={planeswalkerApplied ? "default" : "outlined"}
        onClick={() => setPlaneswalkerApplied(!planeswalkerApplied)}
      />

      <Chip
        text="Battle"
        disabled={disabled}
        type={battleApplied ? "default" : "outlined"}
        onClick={() => setBattleApplied(!battleApplied)}
      />
    </View>
  );

  if (flat) return typeFiltersList;

  return (
    <View>
      <Chip type="outlined" text="Type" onClick={() => setExpanded(!expanded)}>
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
        {typeFiltersList}
      </Dropdown>
    </View>
  );
}
