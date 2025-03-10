import { SortType } from "@/constants/sorting";
import { PreferenceColor } from "@/constants/ui/colors";
import { DeckSortType } from "@/models/deck/dtos/deck-filters.dto";
import {
  DeckCardGalleryGroupTypes,
  DeckCardGallerySortTypes,
  DeckCardGalleryViewTypes,
} from "../deck/deck-gallery-filters";
import { DeckViewType } from "../deck/dtos/deck-filters.dto";

export interface UserPreferences {
  decksViewType?: DeckViewType;
  decksSortType?: DeckSortType;

  deckCardViewType?: DeckCardGalleryViewTypes;
  deckCardGrouping?: DeckCardGalleryGroupTypes;
  deckCardSortType?: DeckCardGallerySortTypes;
  deckCardSortDirection?: SortType;

  deckCardColumnShowPrice?: boolean;
  deckCardColumnShowManaValue?: boolean;
  deckCardColumnGroupMulticolored?: boolean;

  color?: PreferenceColor;
}
