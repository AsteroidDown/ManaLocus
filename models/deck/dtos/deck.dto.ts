import { MTGFormat } from "@/constants/mtg/mtg-format";
import { DashboardSection } from "@/models/dashboard/dashboard";
import { DeckCard } from "../deck";

export interface DeckDTO {
  name?: string;
  description?: string;
  bracket?: number;
  bracketGuess?: number;

  private?: boolean;
  format?: MTGFormat;

  colors?: string;
  featuredArtUrl?: string;

  cards?: DeckCard[];

  dashboard?: DashboardSection[];

  commanderId?: string;
  partnerId?: string;

  isKit?: boolean;
  isCollection?: boolean;
  inProgress?: boolean;

  kits?: string[];
}
