import { setLocalStorageJwt } from "@/functions/local-storage/auth-token-local-storage";
import { setLocalStorageUser } from "@/functions/local-storage/user-local-storage";
import { mapDatabaseUser } from "@/functions/mapping/user-mapping";
import { UserFiltersDTO } from "@/models/user/dtos/user-filters.dto";
import { User } from "@/models/user/user";
import API from "../api-methods/api-methods";
import {
  DefaultPagination,
  PaginatedResponse,
  PaginationOptions,
} from "../pagination";

async function getMany(
  filters?: UserFiltersDTO,
  pagination?: PaginationOptions
): Promise<PaginatedResponse<User>> {
  if (!pagination) pagination = DefaultPagination;

  const response: PaginatedResponse<User> = await API.get(`users/`, {
    ...pagination,
    ...filters,
  }).catch((error) => console.error(`Error retrieving users: ${error}`));

  return {
    meta: response?.meta,
    data: response?.data.map((user) => mapDatabaseUser(user)),
  };
}

async function get(userId: string): Promise<User> {
  return await API.get(`users/${userId}`).then((response) =>
    mapDatabaseUser(response)
  );
}

async function getCurrentUser(): Promise<User | null> {
  if (!localStorage.getItem("user-access")) return null;

  return await API.get(`users/current/`)
    .then((response) => mapDatabaseUser(response))
    .catch((error) => {
      console.error(`Error retrieving current user: ${error}`);
      return null;
    });
}

async function register(
  username: string,
  password: string,
  email: string
): Promise<User> {
  return await API.post(`users/register/`, {
    username: username,
    password: password,
    email: email,
  }).catch((error) => console.error(`Error registering user: ${error}`));
}

async function login(username: string, password: string) {
  return await API.post(`users/login/`, {
    username: username,
    password: password,
  })
    .then((response) => {
      if (response?.access && response?.refresh) {
        setLocalStorageJwt({
          access: response.access,
          refresh: response.refresh,
        });

        const user = mapDatabaseUser(response);
        setLocalStorageUser(user, password);

        return user;
      }

      return null;
    })
    .catch((error) => console.error(`Error logging in: ${error}`));
}

async function refresh() {
  const refreshToken = localStorage.getItem("user-refresh");
  if (!refreshToken) return;

  return await API.post(`token/refresh/`, { refresh: refreshToken })
    .then((response) => {
      if (response) {
        localStorage.setItem("user-access", response.access);
      }

      return response;
    })
    .catch((error) => console.error(`Error refreshing token: ${error}`));
}

async function logout() {
  return await API.post(`users/logout/`)
    .then(() => {
      localStorage.removeItem("user-access");
      localStorage.removeItem("user-refresh");
    })
    .catch((error) => console.error(`Error logging out: ${error}`));
}

const UserService = {
  getMany,
  get,
  getCurrentUser,
  register,
  login,
  refresh,
  logout,
};

export default UserService;
