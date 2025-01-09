import { DeckViewType } from "@/models/deck/dtos/deck-filters.dto";
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
  };

  return localStorage.setItem(
    "user-preferences",
    JSON.stringify(updatedPreferences)
  );
}
