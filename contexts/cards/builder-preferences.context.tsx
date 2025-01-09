import { BuilderPreferences } from "@/models/preferences/builder-preferences";
import { createContext } from "react";

const BuilderPreferencesContext = createContext({
  preferences: {} as BuilderPreferences,
  setPreferences: (preferences: BuilderPreferences) => {},
});

export default BuilderPreferencesContext;
