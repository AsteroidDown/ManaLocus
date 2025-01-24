import { Ruling } from "@/models/card/ruling";

export function MapRulings(rulings: any[]): Ruling[] {
  return rulings.map((ruling: any) => {
    return {
      oracleId: ruling.oracle_id,
      source: ruling.source,
      publishedAt: ruling.published_at,
      comment: ruling.comment,
    };
  });
}
