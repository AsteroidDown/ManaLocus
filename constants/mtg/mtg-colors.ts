export type MTGColor =
  | "white"
  | "blue"
  | "black"
  | "red"
  | "green"
  | "gold"
  | "colorless"
  | "land"
  | "mono";

export enum MTGColors {
  WHITE = "white",
  BLUE = "blue",
  BLACK = "black",
  RED = "red",
  GREEN = "green",
  GOLD = "gold",
  COLORLESS = "colorless",
  LAND = "land",
}

export type MTGColorSymbol = "W" | "U" | "B" | "R" | "G" | "M" | "C" | "1";

export enum MTGColorSymbols {
  WHITE = "W",
  BLUE = "U",
  BLACK = "B",
  RED = "R",
  GREEN = "G",
  GOLD = "M",
  COLORLESS = "C",
  MONO = "1",
}

export const MTGColorMap = new Map<MTGColor, MTGColorSymbol>([
  [MTGColors.WHITE, MTGColorSymbols.WHITE],
  [MTGColors.BLUE, MTGColorSymbols.BLUE],
  [MTGColors.BLACK, MTGColorSymbols.BLACK],
  [MTGColors.RED, MTGColorSymbols.RED],
  [MTGColors.GREEN, MTGColorSymbols.GREEN],
  [MTGColors.GOLD, MTGColorSymbols.GOLD],
  [MTGColors.COLORLESS, MTGColorSymbols.COLORLESS],
  ["mono", MTGColorSymbols.MONO],
]);

export const MTGColorSymbolMap = new Map<MTGColorSymbol, MTGColor>([
  [MTGColorSymbols.WHITE, MTGColors.WHITE],
  [MTGColorSymbols.BLUE, MTGColors.BLUE],
  [MTGColorSymbols.BLACK, MTGColors.BLACK],
  [MTGColorSymbols.RED, MTGColors.RED],
  [MTGColorSymbols.GREEN, MTGColors.GREEN],
  [MTGColorSymbols.GOLD, MTGColors.GOLD],
  [MTGColorSymbols.COLORLESS, MTGColors.COLORLESS],
  [MTGColorSymbols.MONO, "mono"],
]);

export const MTGColorValueMap = new Map<MTGColorSymbol, string>([
  [MTGColorSymbols.WHITE, "#f9faf4"],
  [MTGColorSymbols.BLUE, "#0e68ab"],
  [MTGColorSymbols.BLACK, "#471480"],
  [MTGColorSymbols.RED, "#d3202a"],
  [MTGColorSymbols.GREEN, "#00733d"],
  [MTGColorSymbols.GOLD, "#fcba03"],
  [MTGColorSymbols.COLORLESS, "#878787"],
  [MTGColorSymbols.MONO, "#471480"],
]);
