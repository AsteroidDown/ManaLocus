import { CardFilters } from "../sorted-cards/sorted-cards";

export interface BuilderPreferences {
  filters?: CardFilters;
  groupMulticolored?: boolean;
  hideCardImages?: boolean;
}
