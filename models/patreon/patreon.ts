export interface Patreon {
  patreonId: string;
  name: string;
  email: string;
  user: string;

  tierId: string;
  tierName: PatreonTier;
  tierValue: number;
}

export enum PatreonTier {
  EARLY_ADOPTER = "Early Adopter",
  SUPPORT = "Support",
  REFINEMENT = "Refinement",
  INNOVATION = "Innovation",
  BEYOND = "Beyond",
  LOCUS = "Locus",
}
