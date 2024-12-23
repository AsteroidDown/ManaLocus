import { MTGLegality } from "@/constants/mtg/mtg-legality";
import { MTGRarity } from "@/constants/mtg/mtg-rarity";
import { MTGColorSymbol } from "../../constants/mtg/mtg-colors";

export interface Card {
  scryfallId: string;
  count: number;
  group?: string;
  set: string;
  setName: string;
  collectorNumber: string;
  releasedAt: string;
  cardBackId: string;
  artist?: string;

  name: string;
  colors: MTGColorSymbol[];
  colorIdentity: MTGColorSymbol[];
  manaCost: string;
  cmc: number;
  rarity: MTGRarity;
  typeLine: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  defense?: string;
  producedMana?: string[];
  oracleText?: string;
  flavorText?: string;

  borderColor: string;
  fullArt: boolean;
  frame: string;
  frameEffects: string[];
  promo: boolean;
  finishes: string[];
  foil: boolean;
  nonfoil: boolean;
  lang: string;

  imageURIs?: CardImageUris;
  faces: { front: CardFace; back: CardFace } | null;
  prices: CardPrices;
  priceUris: CardPriceUris;
  legalities: CardLegalities;
  allParts: CardPart[];
}

export type CardBorderColor = "black" | "borderless";

export type CardFrameEffect = "showcase" | "extendedart";

export interface CardImageUris {
  small: string;
  normal: string;
  large: string;

  png: string;
  artCrop: string;
  borderCrop: string;
}

export interface CardFace {
  name: string;
  typeLine: string;
  manaCost: string;
  loyalty?: string;
  defense?: string;
  power?: string;
  toughness?: string;
  oracleText: string;
  flavorText?: string;
  imageUris: CardImageUris;
  artist: string;
  frameEffects?: string[];
}

export interface CardPrices {
  usd: number | null;
  usdFoil: number | null;
  usdEtched: number | null;
  eur: number | null;
  eurFoil: number | null;
  tix: number | null;
}

export interface CardPriceUris {
  tcgplayer?: string;
  cardmarket?: string;
  cardhoarder?: string;
}

export interface CardLegalities {
  // Common formats
  standard: MTGLegality;
  pioneer: MTGLegality;
  modern: MTGLegality;
  legacy: MTGLegality;
  vintage: MTGLegality;

  commander: MTGLegality;
  oathbreaker: MTGLegality;

  alchemy: MTGLegality; // Arena Standard Equivalent
  explorer: MTGLegality; // Arena Pioneer Equivalent
  historic: MTGLegality; // Arena Modern Equivalent
  timeless: MTGLegality; // Arena Legacy Equivalent

  brawl: MTGLegality;
  pauper: MTGLegality;
  penny: MTGLegality;

  // Non-common formats
  future: MTGLegality;
  gladiator: MTGLegality;
  standardbrawl: MTGLegality;
  paupercommander: MTGLegality;
  duel: MTGLegality;
  oldschool: MTGLegality;
  premodern: MTGLegality;
  pred: MTGLegality;
}

export interface CardPart {
  component: string;
  id: string;
  name: string;
  object: string;
  typeLine: string;
  uri: string;
}

export enum CardPartTypes {
  COMBO_PIECE = "combo_piece",
  TOKEN = "token",
}

export type CardIdentifier =
  | {
      id: string;
    }
  | {
      name: string;
    }
  | {
      set: string;
      collector_number: string;
    };
