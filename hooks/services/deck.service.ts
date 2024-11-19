import { DeckDTO } from "@/models/deck/deck";
import API from "../api-methods/api-methods";

async function getPublic() {
  return await API.get(`decks/public`).catch((error) =>
    console.log(`Error retrieving public decks.\nError: ${error}`)
  );
}

async function getById(deckId: string, publicDecks?: boolean) {
  return await API.get(`decks/${publicDecks ? "public/" : ""}`, { id: deckId })
    .then((decks) => decks[0])
    .catch((error) => {
      console.log(
        `Error retrieving deck with id: (${deckId}).\nError: ${error}`
      );
    });
}

async function getByUser(userId: string, includePrivate?: boolean) {
  return await API.get(`decks/${userId}`, {
    params: { includePrivate: includePrivate ? "true" : "false" },
  }).catch((error) =>
    console.log(
      `Error retrieving decks for user: (${userId}).\nError: ${error}`
    )
  );
}

async function create(data: DeckDTO) {
  return await API.post(`decks/`, { ...data }, true).catch((error) => {
    console.log(
      `Error creating deck with name: (${data.name}).\nError: ${error}`
    );
  });
}

async function update(deckId: string, data: DeckDTO) {
  return await API.patch(`decks/`, { id: deckId, ...data }, true).catch(
    (error) => {
      console.log(`Error updating deck with id: (${deckId}).\nError: ${error}`);
    }
  );
}

async function remove(deckId: string) {
  return await API.delete(`decks/${deckId}`, true).catch((error) => {
    console.log(`Error removing deck with id: (${deckId}).\nError: ${error}`);
  });
}

const DeckService = {
  getPublic,
  getById,
  getByUser,
  create,
  update,
  remove,
};

export default DeckService;
