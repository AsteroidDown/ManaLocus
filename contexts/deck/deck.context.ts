import { Deck } from "@/models/deck/deck";
import { createContext } from "react";

const DeckContext = createContext({
  deck: null as Deck | null,
  setDeck: (deck: Deck | null) => {},
});

export default DeckContext;
