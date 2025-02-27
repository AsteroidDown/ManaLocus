export type DeckCardGalleryViewType = "list" | "card";

export enum DeckCardGalleryViewTypes {
  LIST = "list",
  CARD = "card",
}

export type DeckCardGallerySortType = "name" | "mana-value" | "price";

export enum DeckCardGallerySortTypes {
  NAME = "name",
  MANA_VALUE = "mana-value",
  PRICE = "price",
}

export type DeckCardGalleryGroupType =
  | "type"
  | "color"
  | "mana-value"
  | "rarity";

export enum DeckCardGalleryGroupTypes {
  TYPE = "type",
  COLOR = "color",
  MANA_VALUE = "mana-value",
  RARITY = "rarity",
  CUSTOM = "custom",
}
