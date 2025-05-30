import { SpellbookCombo } from "./spellbook-combo";

export interface SpellbookList {
  count: number;
  next: string;
  previous: string;
  results: SpellbookListResults;
}

export interface SpellbookListResults {
  identity: string;
  almostIncluded: SpellbookCombo[];
  almostIncludedByAddingColors: SpellbookCombo[];
  almostIncludedByAddingColorsAndChangingCommanders: SpellbookCombo[];
  almostIncludedByChangingCommanders: SpellbookCombo[];
  included: SpellbookCombo[];
  includedByChangingCommanders: SpellbookCombo[];
}
