import { MTGRarities, MTGRarity } from "./mtg-rarity";

export type MTGFormat =
  | "standard"
  | "pioneer"
  | "modern"
  | "legacy"
  | "vintage"
  | "commander"
  | "oathbreaker"
  | "cube"
  | "alchemy"
  | "explorer"
  | "historic"
  | "timeless"
  | "brawl"
  | "pauper"
  | "penny"
  | "future"
  | "gladiator"
  | "standardbrawl"
  | "paupercommander"
  | "duel"
  | "oldschool"
  | "premodern"
  | "pred";

export enum MTGFormats {
  STANDARD = "standard",
  PIONEER = "pioneer",
  MODERN = "modern",
  LEGACY = "legacy",
  VINTAGE = "vintage",
  COMMANDER = "commander",
  OATHBREAKER = "oathbreaker",
  CUBE = "cube",
  ALCHEMY = "alchemy",
  EXPLORER = "explorer",
  HISTORIC = "historic",
  TIMELESS = "timeless",
  BRAWL = "brawl",
  PAUPER = "pauper",
  PENNY = "penny",
  FUTURE = "future",
  GLADIATOR = "gladiator",
  STANDARDBRAWL = "standardbrawl",
  PAUPERCOMMANDER = "paupercommander",
  DUEL = "duel",
  OLDSCHOOL = "oldschool",
  PREMODERN = "premodern",
  PRED = "pred",
}

export const FormatsWithCommander = [
  MTGFormats.COMMANDER,
  MTGFormats.OATHBREAKER,
  MTGFormats.DUEL,
  MTGFormats.BRAWL,
  MTGFormats.STANDARDBRAWL,
  MTGFormats.PAUPERCOMMANDER,
  MTGFormats.PRED,
];

export interface MTGFormatRestrictions {
  deckMinSize?: number;
  deckMaxSize?: number;
  uniqueCardCount?: number;
  sideBoard?: boolean;
  commander?: boolean;
  signatureSpell?: boolean;
  maxRarity?: MTGRarity;
  maxTix?: number;
}

export const MTGFormatRestrictionsMap = new Map<
  MTGFormat,
  MTGFormatRestrictions
>([
  [
    MTGFormats.STANDARD,
    {
      deckMinSize: 60,
      uniqueCardCount: 4,
      sideBoard: true,
    },
  ],
  [
    MTGFormats.PIONEER,
    {
      deckMinSize: 60,
      uniqueCardCount: 4,
      sideBoard: true,
    },
  ],
  [
    MTGFormats.MODERN,
    {
      deckMinSize: 60,
      uniqueCardCount: 4,
      sideBoard: true,
    },
  ],
  [
    MTGFormats.LEGACY,
    {
      deckMinSize: 60,
      uniqueCardCount: 4,
      sideBoard: true,
    },
  ],
  [
    MTGFormats.VINTAGE,
    {
      deckMinSize: 60,
      uniqueCardCount: 4,
      sideBoard: true,
    },
  ],
  [
    MTGFormats.COMMANDER,
    {
      deckMinSize: 100,
      deckMaxSize: 100,
      uniqueCardCount: 1,
      commander: true,
    },
  ],
  [
    MTGFormats.OATHBREAKER,
    {
      deckMinSize: 60,
      deckMaxSize: 60,
      uniqueCardCount: 1,
      commander: true,
      signatureSpell: true,
    },
  ],
  [
    MTGFormats.ALCHEMY,
    {
      deckMinSize: 60,
      uniqueCardCount: 4,
      sideBoard: true,
    },
  ],
  [
    MTGFormats.EXPLORER,
    {
      deckMinSize: 60,
      uniqueCardCount: 4,
      sideBoard: true,
    },
  ],
  [
    MTGFormats.HISTORIC,
    {
      deckMinSize: 60,
      uniqueCardCount: 4,
      sideBoard: true,
    },
  ],
  [
    MTGFormats.TIMELESS,
    {
      deckMinSize: 60,
      uniqueCardCount: 4,
      sideBoard: true,
    },
  ],
  [
    MTGFormats.BRAWL,
    {
      deckMinSize: 60,
      deckMaxSize: 60,
      uniqueCardCount: 1,
      commander: true,
    },
  ],
  [
    MTGFormats.PAUPER,
    {
      deckMinSize: 60,
      uniqueCardCount: 4,
      sideBoard: true,
      maxRarity: MTGRarities.COMMON,
    },
  ],
  [
    MTGFormats.PENNY,
    {
      deckMinSize: 60,
      uniqueCardCount: 4,
      sideBoard: true,
      maxTix: 0.02,
    },
  ],
  [
    MTGFormats.GLADIATOR,
    {
      deckMinSize: 100,
      deckMaxSize: 100,
      uniqueCardCount: 1,
    },
  ],
  [
    MTGFormats.STANDARDBRAWL,
    {
      deckMinSize: 60,
      deckMaxSize: 60,
      uniqueCardCount: 1,
      commander: true,
    },
  ],
  [
    MTGFormats.PAUPERCOMMANDER,
    {
      deckMinSize: 100,
      deckMaxSize: 100,
      uniqueCardCount: 1,
      commander: true,
      maxRarity: MTGRarities.COMMON,
    },
  ],
  [
    MTGFormats.DUEL,
    {
      deckMinSize: 100,
      deckMaxSize: 100,
      uniqueCardCount: 1,
      commander: true,
    },
  ],
  [
    MTGFormats.OLDSCHOOL,
    {
      deckMinSize: 60,
      uniqueCardCount: 4,
      sideBoard: true,
    },
  ],
  [
    MTGFormats.PREMODERN,
    {
      deckMinSize: 60,
      uniqueCardCount: 4,
      sideBoard: true,
    },
  ],
  [
    MTGFormats.PRED,
    {
      deckMinSize: 100,
      deckMaxSize: 100,
      uniqueCardCount: 1,
      commander: true,
    },
  ],
]);
