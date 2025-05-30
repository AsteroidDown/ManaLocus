import { Deck } from "@/models/deck/deck";
import { SpellbookList } from "@/models/spellbook/spellbook-list";
import API from "../api-methods/api-methods";

async function getCombos(deck: Deck, limit?: number) {
  const response: SpellbookList = await API.post(`commander-spellbook/`, {
    ...(limit && { limit }),
    main: deck.main.map((card) => ({ card: card.name, quantity: card.count })),
    commanders: [
      ...(deck.commander
        ? [{ card: deck.commander.name, quantity: deck.commander.count }]
        : []),
      ...(deck.partner
        ? [{ card: deck.partner.name, quantity: deck.partner.count }]
        : []),
    ],
  });

  return response;
}

const SpellbookService = {
  getCombos,
};

export default SpellbookService;
