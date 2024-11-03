import { MTGLegality } from "@/constants/mtg/mtg-legality";
import { MTGRarity } from "@/constants/mtg/mtg-rarity";
import { MTGColorSymbol } from "../../constants/mtg/mtg-colors";

export interface Card {
  id: string;
  name: string;
  count: number;
  set: string;
  borderColor: string;
  frameEffects: string[];
  promo: boolean;
  collectorNumber: string;
  cardBackId: string;
  rarity: MTGRarity;
  cmc: number;
  colorIdentity: MTGColorSymbol[];
  manaCost: string;
  typeLine: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  defense?: string;
  producedMana?: string[];
  oracleText?: string;
  flavorText?: string;
  images?: CardImageUris;
  artist?: string;
  faces: { front: CardFace; back: CardFace } | null;
  prices: CardPrices;
  priceUris: CardPriceUris;
  legalities: CardLegalities;
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
