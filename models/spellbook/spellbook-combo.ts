export interface SpellbookCombo {
  id: string;
  status: SpellbookComboStatus;
  uses: SpellbookComboCard[];
  requires: SpellbookComboRequirement[];
  produces: SpellbookComboResult[];
  of: SpellbookComboId[];
  includes: SpellbookComboId[];
  identity: string;
  manaNeeded: string;
  manaValueNeeded: string;
  easyPrerequisites: string;
  notablePrerequisites: string;
  description: string;
  notes: string;
  popularity: number;
  spoiler: boolean;
  bracketTag: SpellbookBracketTag;
  legalities: SpellbookLegality;
  prices: SpellbookPrices;
  variantCount: number;
}

export enum SpellbookComboStatus {
  "N" = "New",
  "D" = "Draft",
  "NR" = "Needs Review",
  "OK" = "Ok",
  "E" = "Example",
  "R" = "Restore",
  "NW" = "Not Working",
}

export interface SpellbookComboCard {
  card: SpellbookCard;
  zoneLocations: any;
  battlefieldCardState: string;
  exileCardState: string;
  libraryCardState: string;
  graveyardCardState: string;
  mustBeCommander: boolean;
  quantity: number;
}

export interface SpellbookCard {
  id: number;
  name: string;
  oracleId: string;
  spoiler: boolean;
  typeLine: string;
}

export interface SpellbookComboRequirement {
  template: SpellbookTemplate;
}

export interface SpellbookTemplate {
  id: number;
  name: string;
  scryfallQuery: string;
  scryfallApi: string;
}

export interface SpellbookComboResult {
  feature: {
    id: string;
    name: string;
    uncountable: boolean;
    status: SpellbookComboResultStatus;
  };
  quantity: number;
}

export enum SpellbookComboResultStatus {
  "U" = "Utility",
  "H" = "Helper",
  "C" = "Contextual",
  "S" = "Standalone",
}

export interface SpellbookComboId {
  id: string;
}

export enum SpellbookBracketTag {
  "C" = "Casual",
  "R" = "Ruthless",
  "S" = "Spicy",
  "P" = "Powerful",
  "O" = "Oddball",
  "PA" = "Precon Appropriate",
}

export interface SpellbookLegality {
  commander: boolean;
  pauperCommanderMain: boolean;
  pauperCommander: boolean;
  oathbreaker: boolean;
  predh: boolean;
  brawl: boolean;
  vintage: boolean;
  legacy: boolean;
  premodern: boolean;
  modern: boolean;
  pioneer: boolean;
  standard: boolean;
  pauper: boolean;
}

export interface SpellbookPrices {
  tcgplayer: string;
  cardkingdom: string;
  cardmarket: string;
}
