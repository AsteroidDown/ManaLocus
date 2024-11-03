import { MTGSetType } from "@/constants/mtg/mtg-set-types";

export interface Set {
  id: string;
  code: string;
  name: string;
  uri: string;
  scryfallUri: string;
  searchUri: string;
  releasedAt: string;
  setType: MTGSetType;
  cardCount: number;
  digital: boolean;
  iconSvgUri: string;
}
