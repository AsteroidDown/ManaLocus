import { Preferences } from "@/models/preferences/preferences";
import { Platform } from "react-native";

export function getLocalStoragePreferences(): Preferences | null {
  if (Platform.OS === "ios") return null;

  const preferences: Preferences = JSON.parse(
    localStorage.getItem("preferences") || "{}"
  );

  return preferences;
}

export function setLocalStoragePreferences(preferences: Preferences) {
  let storedPreferences = getLocalStoragePreferences();

  if (!storedPreferences?.filters) {
    localStorage.setItem(
      "preferences",
      JSON.stringify({
        filters: preferences.filters || [],
        groupMulticolored: preferences.groupMulticolored || false,
        hideCardImages: preferences.hideCardImages || false,
      })
    );

    return;
  }

  if (preferences.filters !== undefined) {
    if (preferences.filters.colorFilter !== undefined) {
      storedPreferences.filters.colorFilter = preferences.filters.colorFilter;
    }
    if (preferences.filters.typeFilter !== undefined) {
      storedPreferences.filters.typeFilter = preferences.filters.typeFilter;
    }
    if (preferences.filters.rarityFilter !== undefined) {
      storedPreferences.filters.rarityFilter = preferences.filters.rarityFilter;
    }
  }

  if (preferences.groupMulticolored !== undefined) {
    storedPreferences.groupMulticolored = preferences.groupMulticolored;
  }
  if (preferences.hideCardImages !== undefined) {
    storedPreferences.hideCardImages = preferences.hideCardImages;
  }

  return localStorage.setItem("preferences", JSON.stringify(storedPreferences));
}
