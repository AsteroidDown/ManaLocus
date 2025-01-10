import { DeckSortType } from "@/models/deck/dtos/deck-filters.dto";
import { DeckViewType } from "../deck/dtos/deck-filters.dto";

export interface UserPreferences {
  decksViewType?: DeckViewType;
  decksSortType?: DeckSortType;
}
