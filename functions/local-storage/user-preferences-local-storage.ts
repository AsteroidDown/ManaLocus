import {
  DeckCardGalleryGroupTypes,
  DeckCardGallerySortTypes,
  DeckCardGalleryViewTypes,
} from "@/components/decks/deck-card-gallery";
import { SortTypes } from "@/constants/sorting";
import {
  DeckSortTypes,
  DeckViewType,
} from "@/models/deck/dtos/deck-filters.dto";
import { UserPreferences } from "@/models/preferences/user-preferences";
import { Platform } from "react-native";

export function getLocalStorageUserPreferences(): UserPreferences | null {
  if (Platform.OS === "ios") return null;

  const preferences: UserPreferences = JSON.parse(
    localStorage.getItem("user-preferences") || "{}"
  );

  return preferences;
}

export function setLocalStorageUserPreferences(preferences: UserPreferences) {
  const storedPreferences = getLocalStorageUserPreferences();

  const updatedPreferences: UserPreferences = {
    decksViewType:
      preferences?.decksViewType ??
      storedPreferences?.decksViewType ??
      DeckViewType.CARD,
    decksSortType:
      preferences?.decksSortType ??
      storedPreferences?.decksSortType ??
      DeckSortTypes.CREATED,
    deckCardViewType:
      preferences?.deckCardViewType ??
      storedPreferences?.deckCardViewType ??
      DeckCardGalleryViewTypes.CARD,
    deckCardGrouping:
      preferences?.deckCardGrouping ??
      storedPreferences?.deckCardGrouping ??
      DeckCardGalleryGroupTypes.TYPE,
    deckCardSortType:
      preferences?.deckCardSortType ??
      storedPreferences?.deckCardSortType ??
      DeckCardGallerySortTypes.NAME,
    deckCardSortDirection:
      preferences?.deckCardSortDirection ??
      storedPreferences?.deckCardSortDirection ??
      SortTypes.ASC,
    deckCardColumnShowPrice:
      preferences?.deckCardColumnShowPrice ??
      storedPreferences?.deckCardColumnShowPrice ??
      false,
    deckCardColumnShowManaValue:
      preferences?.deckCardColumnShowManaValue ??
      storedPreferences?.deckCardColumnShowManaValue ??
      true,
    deckCardColumnGroupMulticolored:
      preferences?.deckCardColumnGroupMulticolored ??
      storedPreferences?.deckCardColumnGroupMulticolored ??
      false,
  };

  return localStorage.setItem(
    "user-preferences",
    JSON.stringify(updatedPreferences)
  );
}
