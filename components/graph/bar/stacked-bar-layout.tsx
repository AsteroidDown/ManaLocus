import CardViewMultipleModal from "@/components/cards/card-view-multiple-modal";
import { MTGColors } from "@/constants/mtg/mtg-colors";
import { MTGRarity } from "@/constants/mtg/mtg-rarity";
import { getBarHeight } from "@/functions/cards/card-graphing";
import React from "react";
import { DimensionValue, Pressable, View } from "react-native";
import { BarData } from "./bar";

interface StackedBarLayoutProps {
  data: BarData[];
  total: number;
  topHeight: DimensionValue;
  barHeight: DimensionValue;
  cost?: number;
  rarity?: MTGRarity;
  type?: string;
}

export function StackedBarLayout({
  data,
  total,
  topHeight,
  barHeight,
  cost,
  rarity,
  type,
}: StackedBarLayoutProps) {
  const [whiteOpen, setWhiteOpen] = React.useState(false);
  const [blueOpen, setBlueOpen] = React.useState(false);
  const [blackOpen, setBlackOpen] = React.useState(false);
  const [redOpen, setRedOpen] = React.useState(false);
  const [greenOpen, setGreenOpen] = React.useState(false);
  const [goldOpen, setGoldOpen] = React.useState(false);
  const [colorlessOpen, setColorlessOpen] = React.useState(false);
  const [landOpen, setLandOpen] = React.useState(false);

  const { height: landHeight, count: landCount } = getBarHeight(
    MTGColors.LAND,
    total,
    data
  );
  const { height: colorlessHeight, count: colorlessCount } = getBarHeight(
    MTGColors.COLORLESS,
    total,
    data,
    landHeight
  );
  const { height: goldHeight, count: goldCount } = getBarHeight(
    MTGColors.GOLD,
    total,
    data,
    colorlessHeight
  );
  const { height: greenHeight, count: greenCount } = getBarHeight(
    MTGColors.GREEN,
    total,
    data,
    goldHeight
  );
  const { height: redHeight, count: redCount } = getBarHeight(
    MTGColors.RED,
    total,
    data,
    greenHeight
  );
  const { height: blackHeight, count: blackCount } = getBarHeight(
    MTGColors.BLACK,
    total,
    data,
    redHeight
  );
  const { height: blueHeight, count: blueCount } = getBarHeight(
    MTGColors.BLUE,
    total,
    data,
    blackHeight
  );
  const { height: whiteHeight, count: whiteCount } = getBarHeight(
    MTGColors.WHITE,
    total,
    data,
    blueHeight
  );

  const baseClass =
    "absolute bottom-0 w-full h-full rounded-t-lg bg-gradient-to-t";

  return (
    <View className="flex flex-1 h-full w-full max-w-10 px-1 mx-auto">
      <View style={[{ height: topHeight }]} />

      <View className="flex w-full" style={[{ height: barHeight }]}>
        <View
          style={[
            { bottom: 0 },
            { width: "100%" },
            { position: "absolute" },
            { height: `${whiteHeight}%` },
          ]}
        >
          <Pressable
            className={`${baseClass} to-mtg-white from-mtg-white-secondary`}
            onPress={() => setWhiteOpen(true)}
          />

          <CardViewMultipleModal
            open={whiteOpen}
            setOpen={setWhiteOpen}
            color={MTGColors.WHITE}
            cards={
              data.find((entry) => entry.color === MTGColors.WHITE)?.cards || []
            }
            cost={cost}
            rarity={rarity}
            type={type}
          />
        </View>

        <View
          style={[
            { bottom: 0 },
            { width: "100%" },
            { position: "absolute" },
            { height: `${blueHeight}%` },
          ]}
        >
          <Pressable
            className={`${baseClass} to-mtg-blue from-mtg-blue-secondary`}
            onPress={() => setBlueOpen(true)}
          />

          <CardViewMultipleModal
            open={blueOpen}
            setOpen={setBlueOpen}
            color={MTGColors.BLUE}
            cards={
              data.find((entry) => entry.color === MTGColors.BLUE)?.cards || []
            }
            cost={cost}
            rarity={rarity}
            type={type}
          />
        </View>

        <View
          style={[
            { bottom: 0 },
            { width: "100%" },
            { position: "absolute" },
            { height: `${blackHeight}%` },
          ]}
        >
          <Pressable
            className={`${baseClass} to-mtg-black from-mtg-black-secondary`}
            onPress={() => setBlackOpen(true)}
          />

          <CardViewMultipleModal
            open={blackOpen}
            setOpen={setBlackOpen}
            color={MTGColors.BLACK}
            cards={
              data.find((entry) => entry.color === MTGColors.BLACK)?.cards || []
            }
            cost={cost}
            rarity={rarity}
            type={type}
          />
        </View>

        <View
          style={[
            { bottom: 0 },
            { width: "100%" },
            { position: "absolute" },
            { height: `${redHeight}%` },
          ]}
        >
          <Pressable
            className={`${baseClass} to-mtg-red from-mtg-red-secondary`}
            onPress={() => setRedOpen(true)}
          />

          <CardViewMultipleModal
            open={redOpen}
            setOpen={setRedOpen}
            color={MTGColors.RED}
            cards={
              data.find((entry) => entry.color === MTGColors.RED)?.cards || []
            }
            cost={cost}
            rarity={rarity}
            type={type}
          />
        </View>

        <View
          style={[
            { bottom: 0 },
            { width: "100%" },
            { position: "absolute" },
            { height: `${greenHeight}%` },
          ]}
        >
          <Pressable
            className={`${baseClass} to-mtg-green from-mtg-green-secondary`}
            onPress={() => setGreenOpen(true)}
          />

          <CardViewMultipleModal
            open={greenOpen}
            setOpen={setGreenOpen}
            color={MTGColors.GREEN}
            cards={
              data.find((entry) => entry.color === MTGColors.GREEN)?.cards || []
            }
            cost={cost}
            rarity={rarity}
            type={type}
          />
        </View>

        <View
          style={[
            { bottom: 0 },
            { width: "100%" },
            { position: "absolute" },
            { height: `${goldHeight}%` },
          ]}
        >
          <Pressable
            className={`${baseClass} to-mtg-gold from-mtg-gold-secondary`}
            onPress={() => setGoldOpen(true)}
          />

          <CardViewMultipleModal
            open={goldOpen}
            setOpen={setGoldOpen}
            color={MTGColors.GOLD}
            cards={
              data.find((entry) => entry.color === MTGColors.GOLD)?.cards || []
            }
            cost={cost}
            rarity={rarity}
            type={type}
          />
        </View>

        <View
          style={[
            { bottom: 0 },
            { width: "100%" },
            { position: "absolute" },
            { height: `${colorlessHeight}%` },
          ]}
        >
          <Pressable
            className={`${baseClass} to-mtg-colorless from-mtg-colorless-secondary`}
            onPress={() => setColorlessOpen(true)}
          />

          <CardViewMultipleModal
            open={colorlessOpen}
            setOpen={setColorlessOpen}
            color={MTGColors.COLORLESS}
            cards={
              data.find((entry) => entry.color === MTGColors.COLORLESS)
                ?.cards || []
            }
            cost={cost}
            rarity={rarity}
            type={type}
          />
        </View>

        <View
          style={[
            { bottom: 0 },
            { width: "100%" },
            { position: "absolute" },
            { height: `${landHeight}%` },
          ]}
        >
          <Pressable
            className={`${baseClass} to-mtg-land from-mtg-land-secondary`}
            onPress={() => setLandOpen(true)}
          />

          <CardViewMultipleModal
            open={landOpen}
            setOpen={setLandOpen}
            color={MTGColors.LAND}
            cards={
              data.find((entry) => entry.color === MTGColors.LAND)?.cards || []
            }
            cost={cost}
            rarity={rarity}
            type={type}
          />
        </View>
      </View>
    </View>
  );
}
