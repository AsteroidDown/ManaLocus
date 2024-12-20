import { mapDatabaseDeck } from "@/functions/mapping/deck-mapping";
import { Deck } from "@/models/deck/deck";
import { DeckChange } from "@/models/deck/deck-change";
import { DeckFiltersDTO } from "@/models/deck/dtos/deck-filters.dto";
import { DeckDTO } from "@/models/deck/dtos/deck.dto";
import API from "../api-methods/api-methods";

async function getMany(filters: DeckFiltersDTO) {
  return await API.get(`decks/`, { ...filters })
    .then((decks) => decks.map((deck: any) => mapDatabaseDeck(deck)))
    .catch((error) =>
      console.error(`Error retrieving decks.\nError: ${error}`)
    );
}

async function get(deckId: string): Promise<Deck> {
  return await API.get(`decks/${deckId}`)
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
  return await API.get(`user-decks/${userId}`, {
    includePrivate: includePrivate ? "true" : "false",
  })
    .then((decks) => decks.map((deck: any) => mapDatabaseDeck(deck)))
    .catch((error) =>
      console.error(
        `Error retrieving decks for user: (${userId}).\nError: ${error}`
      )
    );
}

async function getChanges(deckId: string): Promise<DeckChange> {
  return await API.get(`decks/${deckId}/changes`).catch((error) =>
    console.error(
      `Error retrieving changes for deck: (${deckId}).\nError: ${error}`
    )
  );
}

async function getDeckFavorited(deckId: string): Promise<boolean> {
  return await API.get(`decks/${deckId}/favorites/`).then(
    (response) => !!response?.favorited
  );
}

async function getDeckViewed(deckId: string): Promise<boolean> {
  return await API.get(`decks/${deckId}/views/`).then(
    (response) => !!response?.viewed
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
  return await API.patch(`decks/${deckId}/`, { ...data }, true).catch(
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

async function addFavorite(deckId: string) {
  return await API.post(`decks/${deckId}/favorites/`).catch((error) => {
    console.error(
      `Error adding favorite to deck with id: (${deckId}) to favorites.\nError: ${error}`
    );
  });
}

async function removeFavorite(deckId: string) {
  return await API.delete(`decks/${deckId}/favorites/`).catch((error) => {
    console.error(
      `Error removing favorite to deck with id: (${deckId}) from favorites.\nError: ${error}`
    );
  });
}

async function addView(deckId: string) {
  return await API.post(`decks/${deckId}/views/`).catch((error) => {
    console.error(
      `Error adding view to deck with id: (${deckId}) to favorites.\nError: ${error}`
    );
  });
}

const DeckService = {
  get,
  getMany,
  getByUser,
  getChanges,
  getDeckFavorited,
  getDeckViewed,
  create,
  update,
  remove,
  addFavorite,
  removeFavorite,
  addView,
};

export default DeckService;
