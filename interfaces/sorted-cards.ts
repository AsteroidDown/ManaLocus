import { Card } from "../models/card";

export interface CardsSortedByColor {
  white: Card[];
  blue: Card[];
  black: Card[];
  red: Card[];
  green: Card[];
  gold: Card[];
  colorless: Card[];
  land: Card[];
}

export interface CardsSortedByCost {
  zero: Card[];
  one: Card[];
  two: Card[];
  three: Card[];
  four: Card[];
  five: Card[];
  six: Card[];
  seven: Card[];
  land: Card[];
}

export interface CardsSortedByType {
  land: Card[],
  enchantment: Card[],
  artifact: Card[],
  instant: Card[],
  sorcery: Card[],
  creature: Card[],
  planeswalker: Card[],
  battle: Card[]
}

export const CardTypes = {
  CREATURE: "Creature",   
  LAND: "Land",
  ENCHANTMENT: "Enchantment",
  ARTIFACT: "Artifact",
  INSTANT: "Instant",
  SORCERY: "Sorcery",
  PLANESWALKER: "Planeswalker",
  BATTLE: "Battle"
} as const
