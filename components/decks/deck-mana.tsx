import CardViewMultipleModal from "@/components/cards/card-view-multiple-modal";
import PieChart, {
  PieChartSlice,
} from "@/components/ui/graphs/pie-chart/pie-chart";
import Text from "@/components/ui/text/text";
import { MTGColorSymbols, MTGColorValueMap } from "@/constants/mtg/mtg-colors";
import { Card } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

const baseColors = [
  MTGColorSymbols.WHITE,
  MTGColorSymbols.BLUE,
  MTGColorSymbols.BLACK,
  MTGColorSymbols.RED,
  MTGColorSymbols.GREEN,
];

type baseColorSymbol =
  | MTGColorSymbols.WHITE
  | MTGColorSymbols.BLUE
  | MTGColorSymbols.BLACK
  | MTGColorSymbols.RED
  | MTGColorSymbols.GREEN;

type ManaData = {
  count: number;
  cards: Card[];
};

type ChartData = {
  [MTGColorSymbols.WHITE]: ManaData;
  [MTGColorSymbols.BLUE]: ManaData;
  [MTGColorSymbols.BLACK]: ManaData;
  [MTGColorSymbols.RED]: ManaData;
  [MTGColorSymbols.GREEN]: ManaData;
  total: ManaData;
};

interface DeckManaProps {
  deck: Deck;
}

export default function DeckMana({ deck }: DeckManaProps) {
  const [manaPips, setManaPips] = useState<ChartData>({
    [MTGColorSymbols.WHITE]: { count: 0, cards: [] },
    [MTGColorSymbols.BLUE]: { count: 0, cards: [] },
    [MTGColorSymbols.BLACK]: { count: 0, cards: [] },
    [MTGColorSymbols.RED]: { count: 0, cards: [] },
    [MTGColorSymbols.GREEN]: { count: 0, cards: [] },
    total: { count: 0, cards: [] },
  });

  const [manaProduced, setManaProduced] = useState<ChartData>({
    [MTGColorSymbols.WHITE]: { count: 0, cards: [] },
    [MTGColorSymbols.BLUE]: { count: 0, cards: [] },
    [MTGColorSymbols.BLACK]: { count: 0, cards: [] },
    [MTGColorSymbols.RED]: { count: 0, cards: [] },
    [MTGColorSymbols.GREEN]: { count: 0, cards: [] },
    total: { count: 0, cards: [] },
  });

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [cards, setCards] = useState<Card[]>([]);

  const colorMeta = [
    { key: MTGColorSymbols.WHITE, label: "White" },
    { key: MTGColorSymbols.BLUE, label: "Blue" },
    { key: MTGColorSymbols.BLACK, label: "Black" },
    { key: MTGColorSymbols.RED, label: "Red" },
    { key: MTGColorSymbols.GREEN, label: "Green" },
  ];

  const pipChartData = useMemo(() => {
    return colorMeta
      .map(({ key, label }, index) => {
        const count = manaPips[key as keyof ChartData]?.count || 0;
        return count > 0
          ? ({
              key: index,
              value: count,
              label: `${label} Pips`,
              color: MTGColorValueMap.get(key as baseColorSymbol),
              onClick: () => {
                setOpen(true);
                setTitle(`${label} Cards`);
                setCards(manaPips[key as keyof ChartData]?.cards || []);
              },
            } as PieChartSlice)
          : null;
      })
      .filter((d): d is PieChartSlice => d !== null);
  }, [manaPips]);

  const producedChartData = useMemo(() => {
    return colorMeta
      .map(({ key, label }, index) => {
        const count = manaProduced[key as keyof ChartData]?.count || 0;
        return count > 0
          ? ({
              key: index,
              value: count,
              label: `${label} Lands`,
              color: MTGColorValueMap.get(key as baseColorSymbol),
              onClick: () => {
                setOpen(true);
                setTitle(`${label} Lands`);
                setCards(manaProduced[key as keyof ChartData]?.cards || []);
              },
            } as PieChartSlice)
          : null;
      })
      .filter((d): d is PieChartSlice => d !== null);
  }, [manaProduced]);

  useEffect(() => {
    const pipsData: ChartData = {
      [MTGColorSymbols.WHITE]: { count: 0, cards: [] },
      [MTGColorSymbols.BLUE]: { count: 0, cards: [] },
      [MTGColorSymbols.BLACK]: { count: 0, cards: [] },
      [MTGColorSymbols.RED]: { count: 0, cards: [] },
      [MTGColorSymbols.GREEN]: { count: 0, cards: [] },
      total: { count: 0, cards: [] },
    };
    const producedData: ChartData = {
      [MTGColorSymbols.WHITE]: { count: 0, cards: [] },
      [MTGColorSymbols.BLUE]: { count: 0, cards: [] },
      [MTGColorSymbols.BLACK]: { count: 0, cards: [] },
      [MTGColorSymbols.RED]: { count: 0, cards: [] },
      [MTGColorSymbols.GREEN]: { count: 0, cards: [] },
      total: { count: 0, cards: [] },
    };

    const seenCardsPerColor: Record<string, Set<string>> = {};
    baseColors.forEach((color) => {
      seenCardsPerColor[color] = new Set();
    });

    deck.main.forEach((card) => {
      const manaCost = card.faces ? card.faces.front.manaCost : card.manaCost;
      const producedMana = card.faces
        ? card.faces.front.producedMana
        : card.producedMana;
      const isLand = !manaCost;

      if (isLand && producedMana) {
        producedMana.forEach((color) => {
          if (
            deck.colors.includes(color) &&
            producedData[color as baseColorSymbol]
          ) {
            producedData[color as baseColorSymbol].count += card.count;
            producedData[color as baseColorSymbol].cards.push(card);
            producedData.total.count += card.count;
          }
        });
      } else if (manaCost) {
        const pips = getPips(manaCost);

        pips.forEach((pip) => {
          if (pipsData[pip as baseColorSymbol]) {
            pipsData[pip as baseColorSymbol].count += card.count;
            pipsData.total.count += card.count;
          }
        });

        const uniqueColors = new Set(pips);
        uniqueColors.forEach((color) => {
          if (
            pipsData[color as baseColorSymbol] &&
            !seenCardsPerColor[color].has(card.scryfallId)
          ) {
            pipsData[color as baseColorSymbol].cards.push(card);
            seenCardsPerColor[color as baseColorSymbol].add(card.scryfallId);
          }
        });
      }
    });

    setManaPips({ ...pipsData });
    setManaProduced({ ...producedData });
  }, [deck]);

  function getPips(manaCost: string): string[] {
    const deckColors = deck.colors.slice(1, -1).split("");

    return manaCost
      .slice(1, -1)
      .split("}{")
      .flatMap((pip) => pip.split("/"))
      .filter((pip) => deckColors.includes(pip));
  }

  return (
    <View className="relative flex gap-4 lg:ml-4 lg:mr-8 max-h-fit lg:w-fit w-full">
      <Text size="lg" weight="bold" className="mb-2">
        Card Costs & Land Mana
      </Text>

      <View className="flex justify-center items-center">
        <PieChart
          size={200}
          series={[
            {
              gapWidth: 4,
              innerRadius: 3,
              outerRadius: 50,
              data: producedChartData,
            },
            {
              gapWidth: 4,
              innerRadius: 58,
              outerRadius: 100,
              data: pipChartData,
            },
          ]}
        />
      </View>

      <CardViewMultipleModal
        open={open}
        setOpen={setOpen}
        cards={cards}
        title={title}
      />
    </View>
  );
}
