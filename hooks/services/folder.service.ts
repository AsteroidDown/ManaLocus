import { FolderFiltersDto } from "@/models/folder/dtos/folder-filters.dto";
import { DeckFolder } from "@/models/folder/folder";
import API from "../api-methods/api-methods";
import { PaginatedResponse, PaginationOptions } from "../pagination";

async function getMany(
  userId: string,
  dto: FolderFiltersDto,
  pagination?: PaginationOptions
): Promise<PaginatedResponse<DeckFolder>> {
  return await API.get(`folders/${userId}/`, { ...dto, ...pagination });
}

async function get(userId: string, folderId: string): Promise<DeckFolder> {
  return await API.get(`folders/${userId}/${folderId}/`);
}

async function create(userId: string, name: string): Promise<DeckFolder> {
  return await API.post(`folders/${userId}/`, { name });
}

async function update(userId: string, folderId: string, name: string) {
  return await API.patch(`folders/${userId}/${folderId}/`, { name });
}

async function remove(userId: string, folderId: string) {
  return await API.delete(`folders/${userId}/${folderId}/`);
}

async function addDeck(
  userId: string,
  folderId: string,
  deckId: string
): Promise<void> {
  return await API.post(`folders/${userId}/${folderId}/${deckId}/`);
}

async function removeDeck(
  userId: string,
  folderId: string,
  deckId: string
): Promise<void> {
  return await API.delete(`folders/${userId}/${folderId}/${deckId}/`);
}

const FolderService = {
  get,
  getMany,
  create,
  update,
  remove,
  addDeck,
  removeDeck,
};

export default FolderService;
