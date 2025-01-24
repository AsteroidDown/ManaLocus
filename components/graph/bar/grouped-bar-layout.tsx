import CardViewMultipleModal from "@/components/cards/card-view-multiple-modal";
import { MTGColors } from "@/constants/mtg/mtg-colors";
import { MTGRarity } from "@/constants/mtg/mtg-rarity";
import { getBarHeight } from "@/functions/cards/card-graphing";
import React from "react";
import { Pressable, View } from "react-native";
import { BarData } from "./bar";

interface GroupedBarLayoutProps {
  data: BarData[];
  ceiling: number;
  cost?: number;
  rarity?: MTGRarity;
  type?: string;
}

export function GroupedBarLayout({
  data,
  ceiling,
  cost,
  rarity,
  type,
}: GroupedBarLayoutProps) {
  const [whiteOpen, setWhiteOpen] = React.useState(false);
  const [blueOpen, setBlueOpen] = React.useState(false);
  const [blackOpen, setBlackOpen] = React.useState(false);
  const [redOpen, setRedOpen] = React.useState(false);
  const [greenOpen, setGreenOpen] = React.useState(false);
  const [goldOpen, setGoldOpen] = React.useState(false);
  const [colorlessOpen, setColorlessOpen] = React.useState(false);
  const [landOpen, setLandOpen] = React.useState(false);

  const { count: whiteCount, height: whiteHeight } = getBarHeight(
    MTGColors.WHITE,
    ceiling,
    data
  );
  const { count: blueCount, height: blueHeight } = getBarHeight(
    MTGColors.BLUE,
    ceiling,
    data
  );
  const { count: blackCount, height: blackHeight } = getBarHeight(
    MTGColors.BLACK,
    ceiling,
    data
  );
  const { count: redCount, height: redHeight } = getBarHeight(
    MTGColors.RED,
    ceiling,
    data
  );
  const { count: greenCount, height: greenHeight } = getBarHeight(
    MTGColors.GREEN,
    ceiling,
    data
  );
  const { count: goldCount, height: goldHeight } = getBarHeight(
    MTGColors.GOLD,
    ceiling,
    data
  );
  const { count: colorlessCount, height: colorlessHeight } = getBarHeight(
    MTGColors.COLORLESS,
    ceiling,
    data
  );
  const { count: landCount, height: landHeight } = getBarHeight(
    MTGColors.LAND,
    ceiling,
    data
  );

  const baseClasses = "w-full rounded-t-lg bg-gradient-to-t";
  const containerClasses = "flex h-full flex-1";

  return (
    <View className="flex flex-row gap-1 justify-center w-full h-full px-2">
      <View className={containerClasses}>
        <View style={[{ height: `${100 - whiteHeight}%` }]} />

        <View style={[{ height: `${whiteHeight}%` }]}>
          <Pressable
            className={`${baseClasses} h-full to-mtg-white from-mtg-white-secondary`}
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
      </View>

      <View className={containerClasses}>
        <View style={[{ height: `${100 - blueHeight}%` }]} />

        <View style={[{ height: `${blueHeight}%` }]}>
          <Pressable
            className={`${baseClasses} h-full to-mtg-blue from-mtg-blue-secondary`}
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
      </View>

      <View className={containerClasses}>
        <View style={[{ height: `${100 - blackHeight}%` }]} />

        <View style={[{ height: `${blackHeight}%` }]}>
          <Pressable
            className={`${baseClasses} h-full to-mtg-black from-mtg-black-secondary`}
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
      </View>

      <View className={containerClasses}>
        <View style={[{ height: `${100 - redHeight}%` }]} />

        <View style={[{ height: `${redHeight}%` }]}>
          <Pressable
            className={`${baseClasses} h-full to-mtg-red from-mtg-red-secondary`}
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
      </View>

      <View className={containerClasses}>
        <View style={[{ height: `${100 - greenHeight}%` }]} />

        <View style={[{ height: `${greenHeight}%` }]}>
          <Pressable
            className={`${baseClasses} h-full to-mtg-green from-mtg-green-secondary`}
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
      </View>

      <View className={containerClasses}>
        <View style={[{ height: `${100 - goldHeight}%` }]} />

        <View style={[{ height: `${goldHeight}%` }]}>
          <Pressable
            className={`${baseClasses} h-full to-mtg-gold from-mtg-gold-secondary`}
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

        <View className={containerClasses}>
          <View style={[{ height: `${100 - colorlessHeight}%` }]} />

          <View style={[{ height: `${colorlessHeight}%` }]}>
            <Pressable
              className={`${baseClasses} h-full to-mtg-colorless from-mtg-colorless-secondary`}
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
        </View>

        <View className={containerClasses}>
          <View style={[{ height: `${100 - landHeight}%` }]} />

          <View style={[{ height: `${landHeight}%` }]}>
            <Pressable
              className={`${baseClasses} h-full to-mtg-land from-mtg-land-secondary`}
              onPress={() => setLandOpen(true)}
            />

            <CardViewMultipleModal
              open={landOpen}
              setOpen={setLandOpen}
              color={MTGColors.LAND}
              cards={
                data.find((entry) => entry.color === MTGColors.LAND)?.cards ||
                []
              }
              cost={cost}
              rarity={rarity}
              type={type}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
