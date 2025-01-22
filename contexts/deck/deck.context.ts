import { MTGFormat } from "@/constants/mtg/mtg-format";
import { Card } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";
import { createContext } from "react";

const DeckContext = createContext({
  deck: null as Deck | null,
  setDeck: (deck: Deck | null) => {},

  format: null as MTGFormat | null,
  setFormat: (format: MTGFormat | null) => {},

  commander: null as Card | null,
  setCommander: (commander: Card | null) => {},

  partner: null as Card | null,
  setPartner: (partner: Card | null) => {},
});

export default DeckContext;
