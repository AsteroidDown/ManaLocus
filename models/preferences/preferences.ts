import { CardFilters } from "../sorted-cards/sorted-cards";

export interface Preferences {
  filters?: CardFilters;
  groupMulticolored?: boolean;
  hideCardImages?: boolean;
}
