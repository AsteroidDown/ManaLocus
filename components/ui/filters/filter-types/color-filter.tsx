import Chip from "@/components/ui/chip/chip";
import Dropdown from "@/components/ui/dropdown/dropdown";
import Text from "@/components/ui/text/text";
import { MTGColor, MTGColors } from "@/constants/mtg/mtg-colors";
import BuilderPreferencesContext from "@/contexts/cards/builder-preferences.context";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";

export interface ColorFilterProps {
  flat?: boolean;
  reset?: boolean;
  disabled?: boolean;
  excludeMono?: boolean;
  colorFilters?: MTGColor[];
  setColorFilters: React.Dispatch<React.SetStateAction<MTGColor[] | undefined>>;
}

export default function ColorFilter({
  flat,
  reset,
  disabled,
  excludeMono = false,
  colorFilters,
  setColorFilters,
}: ColorFilterProps) {
  const { preferences } = useContext(BuilderPreferencesContext);

  const [expanded, setExpanded] = React.useState(false);

  const [whiteApplied, setWhiteApplied] = React.useState(false);
  const [blueApplied, setBlueApplied] = React.useState(false);
  const [blackApplied, setBlackApplied] = React.useState(false);
  const [redApplied, setRedApplied] = React.useState(false);
  const [greenApplied, setGreenApplied] = React.useState(false);
  const [goldApplied, setGoldApplied] = React.useState(false);
  const [colorlessApplied, setColorlessApplied] = React.useState(false);
  const [monoColorApplied, setMonoColorApplied] = React.useState(false);

  const [appliedFilters, setAppliedFilters] = React.useState([] as MTGColor[]);

  useEffect(() => {
    setAppliedFilters([
      ...(whiteApplied ? [MTGColors.WHITE] : []),
      ...(blueApplied ? [MTGColors.BLUE] : []),
      ...(blackApplied ? [MTGColors.BLACK] : []),
      ...(redApplied ? [MTGColors.RED] : []),
      ...(greenApplied ? [MTGColors.GREEN] : []),
      ...(goldApplied ? [MTGColors.GOLD] : []),
      ...(colorlessApplied ? [MTGColors.COLORLESS] : []),
      ...(monoColorApplied ? ["mono"] : []),
    ] as MTGColor[]);
  }, [
    whiteApplied,
    blueApplied,
    blackApplied,
    redApplied,
    greenApplied,
    goldApplied,
    colorlessApplied,
    monoColorApplied,
  ]);

  useEffect(() => setColorFilters(appliedFilters), [appliedFilters]);

  useEffect(() => {
    setWhiteApplied(false);
    setBlueApplied(false);
    setBlackApplied(false);
    setRedApplied(false);
    setGreenApplied(false);
    setGoldApplied(false);
    setColorlessApplied(false);
    setMonoColorApplied(false);
    setAppliedFilters([]);
  }, [reset]);

  useEffect(() => {
    if (colorFilters?.length) {
      if (colorFilters.includes(MTGColors.WHITE)) setWhiteApplied(true);
      if (colorFilters.includes(MTGColors.BLUE)) setBlueApplied(true);
      if (colorFilters.includes(MTGColors.BLACK)) setBlackApplied(true);
      if (colorFilters.includes(MTGColors.RED)) setRedApplied(true);
      if (colorFilters.includes(MTGColors.GREEN)) setGreenApplied(true);
      if (colorFilters.includes(MTGColors.GOLD)) setGoldApplied(true);
      if (colorFilters.includes(MTGColors.COLORLESS)) {
        setColorlessApplied(true);
      }
      if (colorFilters.includes("mono")) setMonoColorApplied(true);
    } else {
      if (!preferences.filters) return;

      if (preferences.filters.colorFilter?.includes(MTGColors.WHITE)) {
        setWhiteApplied(true);
      }
      if (preferences.filters.colorFilter?.includes(MTGColors.BLUE)) {
        setBlueApplied(true);
      }
      if (preferences.filters.colorFilter?.includes(MTGColors.BLACK)) {
        setBlackApplied(true);
      }
      if (preferences.filters.colorFilter?.includes(MTGColors.RED)) {
        setRedApplied(true);
      }
      if (preferences.filters.colorFilter?.includes(MTGColors.GREEN)) {
        setGreenApplied(true);
      }
      if (preferences.filters.colorFilter?.includes(MTGColors.GOLD)) {
        setGoldApplied(true);
      }
      if (preferences.filters.colorFilter?.includes(MTGColors.COLORLESS)) {
        setColorlessApplied(true);
      }
      if (preferences.filters.colorFilter?.includes("mono")) {
        setMonoColorApplied(true);
      }
    }
  }, [preferences, colorFilters]);

  const colorFiltersList = (
    <View className="flex flex-row flex-wrap gap-2">
      <Chip
        size="sm"
        text="White"
        disabled={disabled}
        action={MTGColors.WHITE}
        type={whiteApplied ? "default" : "outlined"}
        onClick={() => setWhiteApplied(!whiteApplied)}
      />

      <Chip
        size="sm"
        text="Blue"
        disabled={disabled}
        action={MTGColors.BLUE}
        type={blueApplied ? "default" : "outlined"}
        onClick={() => setBlueApplied(!blueApplied)}
      />

      <Chip
        size="sm"
        text="Black"
        disabled={disabled}
        action={MTGColors.BLACK}
        type={blackApplied ? "default" : "outlined"}
        onClick={() => setBlackApplied(!blackApplied)}
      />

      <Chip
        size="sm"
        text="Red"
        disabled={disabled}
        action={MTGColors.RED}
        type={redApplied ? "default" : "outlined"}
        onClick={() => setRedApplied(!redApplied)}
      />

      <Chip
        size="sm"
        text="Green"
        disabled={disabled}
        action={MTGColors.GREEN}
        type={greenApplied ? "default" : "outlined"}
        onClick={() => setGreenApplied(!greenApplied)}
      />

      <Chip
        size="sm"
        text="Gold"
        disabled={disabled}
        action={MTGColors.GOLD}
        type={goldApplied ? "default" : "outlined"}
        onClick={() => setGoldApplied(!goldApplied)}
      />

      <Chip
        size="sm"
        text="Colorless"
        disabled={disabled}
        action={MTGColors.COLORLESS}
        type={colorlessApplied ? "default" : "outlined"}
        onClick={() => setColorlessApplied(!colorlessApplied)}
      />

      {!excludeMono && (
        <Chip
          size="sm"
          text="Mono"
          disabled={disabled}
          type={monoColorApplied ? "default" : "outlined"}
          onClick={() => setMonoColorApplied(!monoColorApplied)}
        />
      )}
    </View>
  );

  if (flat) return colorFiltersList;

  return (
    <View>
      <Chip
        size="sm"
        type="outlined"
        text="Color"
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
        {colorFiltersList}
      </Dropdown>
    </View>
  );
}
