import { mapDatabaseDeck } from "@/functions/mapping/deck-mapping";
import { Deck, DeckDTO } from "@/models/deck/deck";
import { DeckChange } from "@/models/deck/deck-change";
import API from "../api-methods/api-methods";

async function getPublic() {
  return await API.get(`decks/public`)
    .then((decks) => decks.map((deck: any) => mapDatabaseDeck(deck)))
    .catch((error) =>
      console.error(`Error retrieving public decks.\nError: ${error}`)
    );
}

async function get(deckId: string, publicDecks?: boolean): Promise<Deck> {
  return await API.get(`decks/${publicDecks ? "public/" : ""}`, { id: deckId })
    .then((data) => {
      return mapDatabaseDeck(data, true) as any;
    })
    .catch((error) => {
      console.error(
        `Error retrieving deck with id: (${deckId}).\nError: ${error}`
      );
    });
}

async function getByUser(userId: string, includePrivate?: boolean) {
  return await API.get(`decks/`, {
    params: {
      userId,
      includePrivate: includePrivate ? "true" : "false",
    },
  })
    .then((decks) => decks.map((deck: any) => mapDatabaseDeck(deck)))
    .catch((error) =>
      console.error(
        `Error retrieving decks for user: (${userId}).\nError: ${error}`
      )
    );
}

async function getChanges(deckId: string): Promise<DeckChange[]> {
  return await API.get(`decks/${deckId}/changes`).catch((error) =>
    console.error(
      `Error retrieving changes for deck: (${deckId}).\nError: ${error}`
    )
  );
}

async function create(data: DeckDTO) {
  return await API.post(`decks/`, { ...data }, true).catch((error) => {
    console.error(
      `Error creating deck with name: (${data.name}).\nError: ${error}`
    );
  });
}

async function update(deckId: string, data: DeckDTO) {
  return await API.patch(`decks/`, { id: deckId, ...data }, true).catch(
    (error) => {
      console.error(
        `Error updating deck with id: (${deckId}).\nError: ${error}`
      );
    }
  );
}

async function remove(deckId: string) {
  return await API.delete(`decks/${deckId}`, true).catch((error) => {
    console.error(`Error removing deck with id: (${deckId}).\nError: ${error}`);
  });
}

const DeckService = {
  get,
  getPublic,
  getByUser,
  getChanges,
  create,
  update,
  remove,
};

export default DeckService;
