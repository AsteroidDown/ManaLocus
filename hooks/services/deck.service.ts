import { APIbaseURL } from "@/constants/urls";
import { DeckDTO } from "@/models/deck/deck";
import APIAxiosConfig from "../api-methods/api-methods";

const baseURL = `${APIbaseURL}/api/decks`;

async function getPublic() {
  return await APIAxiosConfig.get(`${baseURL}/public`).catch((error) =>
    console.log(`Error retrieving public decks.\nError: ${error}`)
  );
}

async function getById(deckId: string) {
  return await APIAxiosConfig.get(`${baseURL}/${deckId}`).catch((error) => {
    console.log(`Error retrieving deck with id: (${deckId}).\nError: ${error}`);
  });
}

async function getByUser(userId: string, includePrivate?: boolean) {
  return await APIAxiosConfig.get(`${baseURL}/${userId}`, {
    params: { includePrivate: includePrivate ? "true" : "false" },
  }).catch((error) =>
    console.log(
      `Error retrieving decks for user: (${userId}).\nError: ${error}`
    )
  );
}

async function create(deckId: string, data: DeckDTO) {
  return await APIAxiosConfig.patch(
    `${baseURL}/${deckId}`,
    { deckId, ...data },
    {
      withCredentials: true,
    }
  ).catch((error) =>
    console.log(`Error creating deck with id: (${deckId}).\nError: ${error}`)
  );
}

async function update(deckId: string, data: DeckDTO) {
  return await APIAxiosConfig.patch(
    `${baseURL}/${deckId}`,
    { deckId, ...data },
    {
      withCredentials: true,
    }
  ).catch((error) =>
    console.log(`Error updating deck with id: (${deckId}).\nError: ${error}`)
  );
}

async function remove(deckId: string) {
  return await APIAxiosConfig.delete(`${baseURL}/${deckId}`, {
    withCredentials: true,
  }).catch((error) =>
    console.log(`Error removing deck with id: (${deckId}).\nError: ${error}`)
  );
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
