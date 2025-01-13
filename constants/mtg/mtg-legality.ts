export type MTGLegality = "legal" | "not_legal" | "restricted" | "banned";

export enum MTGLegalities {
  LEGAL = "legal",
  NOT_LEGAL = "not_legal",
  RESTRICTED = "restricted",
  BANNED = "banned",
}

export interface LegalityEvaluation {
  legal: boolean;

  cards?: boolean;
  size?: boolean;
  unique?: boolean;
  commander?: boolean;
  signatureSpell?: boolean;
  colorIdentity?: boolean;
  rarity?: boolean;
  tix?: boolean;
}

export const MTGBasicLands = [
  "Plains",
  "Island",
  "Swamp",
  "Mountain",
  "Forest",
  "Wastes",
  "Snow-Covered Plains",
  "Snow-Covered Island",
  "Snow-Covered Swamp",
  "Snow-Covered Mountain",
  "Snow-Covered Forest",
  "Snow-Covered Wastes",
];
