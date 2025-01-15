import { mapDatabaseDeck } from "@/functions/mapping/deck-mapping";
import { Deck } from "@/models/deck/deck";
import { DeckChange } from "@/models/deck/deck-change";
import {
  DeckFiltersDTO,
  DeckKitFiltersDto,
} from "@/models/deck/dtos/deck-filters.dto";
import { DeckDTO } from "@/models/deck/dtos/deck.dto";
import API from "../api-methods/api-methods";
import {
  DefaultPagination,
  PaginatedResponse,
  PaginationOptions,
} from "../pagination";

async function getMany(
  filters: DeckFiltersDTO,
  pagination?: PaginationOptions
): Promise<PaginatedResponse<Deck>> {
  if (!pagination) pagination = DefaultPagination;

  const response: PaginatedResponse<Deck> = await API.get(`decks/`, {
    ...filters,
    ...pagination,
  }).catch((error) =>
    console.error(`Error retrieving decks.\nError: ${error}`)
  );

  return {
    meta: response.meta,
    data: response.data.map((deck) => mapDatabaseDeck(deck)),
  };
}

async function get(deckId: string): Promise<Deck> {
  return await API.get(`decks/${deckId}`)
    .then((data) => mapDatabaseDeck(data, true) as any)
    .catch((error) => {
      console.error(
        `Error retrieving deck with id: (${deckId}).\nError: ${error}`
      );
    });
}

async function getByUser(
  userId: string,
  filters?: DeckFiltersDTO,
  pagination?: PaginationOptions
): Promise<PaginatedResponse<Deck>> {
  if (!pagination) pagination = DefaultPagination;

  const response: PaginatedResponse<Deck> = await API.get(
    `user-decks/${userId}`,
    { ...filters, ...pagination }
  ).catch((error) =>
    console.error(
      `Error retrieving decks for user: (${userId}).\nError: ${error}`
    )
  );

  return {
    meta: response.meta,
    data: response.data.map((deck) => mapDatabaseDeck(deck)),
  };
}

async function getUserFavorites(
  userId: string,
  filters?: DeckFiltersDTO,
  pagination?: PaginationOptions
): Promise<PaginatedResponse<Deck>> {
  if (!pagination) pagination = DefaultPagination;

  const response: PaginatedResponse<Deck> = await API.get(
    `user-decks/${userId}/favorites`,
    {
      ...filters,
      ...pagination,
    }
  ).catch((error) =>
    console.error(
      `Error retrieving decks for user: (${userId}).\nError: ${error}`
    )
  );

  return {
    meta: response.meta,
    data: response.data.map((deck) => mapDatabaseDeck(deck)),
  };
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
  return await API.delete(`decks/${deckId}/`, true).catch((error) => {
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

async function getKits(
  dto: DeckKitFiltersDto,
  pagination?: PaginationOptions
): Promise<PaginatedResponse<Deck>> {
  const response: PaginatedResponse<Deck> = await API.get(`deck-kits/`, {
    ...dto,
    ...pagination,
  }).catch((error) => {
    console.error(`Error retrieving deck kits.\nError: ${error}`);
  });

  return {
    meta: response.meta,
    data: response.data.map((deck) => mapDatabaseDeck(deck)),
  };
}

async function getKit(deckId: string): Promise<Deck> {
  return await API.get(`deck-kits/${deckId}`).then(
    (data) => mapDatabaseDeck(data, true) as any
  );
}

async function getDeckKits(deckId: string): Promise<Deck[]> {
  return await API.get(`decks/${deckId}/kits/`).then((data) =>
    data.map((deck: Deck) => mapDatabaseDeck(deck) as any)
  );
}

async function createDeckKitLink(deckId: string, kitId: string) {
  return await API.post(`decks/${deckId}/kits/`, { kitId }).catch((error) => {
    console.error(
      `Error creating deck kit link with deckId: (${deckId}) and kitId: (${kitId}).\nError: ${error}`
    );
  });
}

async function removeDeckKitLink(deckId: string, kitId: string) {
  return await API.delete(`decks/${deckId}/kits/${kitId}/`).catch((error) => {
    console.error(
      `Error removing deck kit link with deckId: (${deckId}) and kitId: (${kitId}).\nError: ${error}`
    );
  });
}

const DeckService = {
  get,
  getMany,
  getByUser,
  getUserFavorites,
  getChanges,
  getDeckFavorited,
  getDeckViewed,
  create,
  update,
  remove,
  addFavorite,
  removeFavorite,
  addView,
  getKits,
  getKit,
  getDeckKits,
  createDeckKitLink,
  removeDeckKitLink,
};

export default DeckService;
