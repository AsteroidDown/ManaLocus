import { Deck } from "@/models/deck/deck";
import { SpellbookList } from "@/models/spellbook/spellbook-list";
import SpellbookAPI from "../api-methods/spellbook-api-methods";

async function getCombos(deck: Deck, limit?: number) {
  const response: SpellbookList = await SpellbookAPI.post(`find-my-combos`, {
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
