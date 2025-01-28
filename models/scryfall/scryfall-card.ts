import { MTGLegality } from "@/constants/mtg/mtg-legality";
import { MTGRarity } from "@/constants/mtg/mtg-rarity";
import { MTGColorSymbol } from "../../constants/mtg/mtg-colors";
import { CardFrameEffect } from "../card/card";

export interface ScryfallCard {
  id: string;
  set: string;
  set_name: string;
  collector_number: string;
  released_at: string;
  card_back_id: string;
  artist?: string;

  name: string;
  colors: MTGColorSymbol[];
  color_identity: MTGColorSymbol[];
  mana_cost: string;
  cmc: number;
  rarity: MTGRarity;
  type_line: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  defense?: string;
  produced_mana: any[];
  oracle_text: string;
  flavor_text?: string;

  border_color: string;
  full_art: boolean;
  frame: string;
  frame_effects: CardFrameEffect[];
  promo: boolean;
  promo_types: string[];
  finishes: string[];
  foil: boolean;
  nonfoil: boolean;
  lang: string;

  image_uris: ScryfallImageUris;
  card_faces: ScryfallCardFace[];
  prices: ScryfallCardPrices;
  purchase_uris: ScryfallCardPriceUris;
  legalities: ScryfallCardLegalities;
  all_parts?: ScryfallCardPart[];
  related_uris: ScryfallRelatedUris;
}

export interface ScryfallImageUris {
  art_crop: string;
  border_crop: string;
  large: string;
  normal: string;
  png: string;
  small: string;
}

export interface ScryfallCardFace {
  name: string;
  type_line: string;
  mana_cost: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  defense?: string;
  oracle_text: string;
  flavor_text?: string;
  image_uris: ScryfallImageUris;
  artist: string;
  frame_effects: string[];
}

export interface ScryfallCardPrices {
  usd: number | null;
  usd_foil: number | null;
  usd_etched: number | null;
  eur: number | null;
  eur_foil: number | null;
  tix: number | null;
}

export interface ScryfallCardPriceUris {
  tcgplayer: string;
  cardmarket: string;
  cardhoarder: string;
}

export interface ScryfallCardLegalities {
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

export interface ScryfallCardPart {
  component: string;
  id: string;
  name: string;
  object: string;
  type_line: string;
  uri: string;
}

export interface ScryfallRelatedUris {
  edhrec: string;
  gatherer: string;
  tcgplayer_infinite_articles: string;
  tcgplayer_infinite_decks: string;
}
