import {
  BracketDetails,
  Brackets,
  BracketType,
  ExtraTurns,
  GameChangers,
  MassLandDenial,
  Tutors,
} from "@/constants/mtg/brackets";
import { Deck } from "@/models/deck/deck";

export function getBracketDetails(deck: Deck): BracketDetails {
  const cards = deck.main.map((card) => card);

  const gameChangers = cards.filter((card) => GameChangers.includes(card.name));
  const tutors = cards.filter((card) => Tutors.includes(card.name));
  const massLandDenial = cards.filter((card) =>
    MassLandDenial.includes(card.name)
  );
  const extraTurns = cards.filter((card) => ExtraTurns.includes(card.name));

  let bracket: BracketType | null;

  if (
    !gameChangers.length &&
    !massLandDenial.length &&
    tutors.length <= (Brackets.Exhibition.maxTutors || 3)
  ) {
    bracket = BracketType.Exhibition;
  } else if (
    !gameChangers.length &&
    !massLandDenial.length &&
    tutors.length <= (Brackets.Core.maxTutors || 5)
  ) {
    bracket = BracketType.Core;
  } else if (
    !massLandDenial.length &&
    gameChangers.length <= (Brackets.Upgraded.maxGameChangers || 3)
  ) {
    bracket = BracketType.Upgraded;
  } else if (
    gameChangers.length >= 7 ||
    tutors.length >= 10 ||
    massLandDenial.length >= 3 ||
    extraTurns.length >= 3
  ) {
    bracket = BracketType.CEDH;
  } else {
    bracket = BracketType.Optimized;
  }

  return {
    bracket,
    gameChangers,
    tutors,
    massLandDenial,
    extraTurns,
  };
}
