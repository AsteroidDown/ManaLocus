import { UserPreferences } from "@/models/preferences/user-preferences";
import { createContext } from "react";

const UserPreferencesContext = createContext({
  preferences: null as UserPreferences | null,
  setPreferences: (preferences: UserPreferences | null) => {},
});

export default UserPreferencesContext;
