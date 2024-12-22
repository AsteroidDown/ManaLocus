import { CardFilters } from "../sorted-cards/sorted-cards";

export interface Preferences {
  filters?: CardFilters;
  cardsCondensed?: boolean;
  groupMulticolored?: boolean;
  hideCardImages?: boolean;
}
