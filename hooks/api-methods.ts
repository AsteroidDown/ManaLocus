import axios, { AxiosResponse } from "axios";
import {
  DECK_ENDPOINT,
  LOGIN_ENDPOINT,
  REFRESH_ACCESS_ENDPOINT,
  REGISTER_USER_ENDPOINT,
  ScryfallURL,
} from "../constants/urls";
import {
  getLocalStorageJwt,
  removeLocalStorageJwt,
} from "@/functions/local-storage/auth-token";
import { Card } from "@/models/card/card";
import cubeApiAxiosConfig from "./axios-config";

function getHeaders() {
  return {
    // "User-Agent": "ChromaticCube/1.0",
    Accept: "*/*",
  };
}

function getCubeApiHeaders() {
  return {
    "Content-Type": "application/json",
  };
}

async function handleResponse(response: AxiosResponse<any, any>) {
  console.log("handle");
  try {
    return response.data;
  } catch (e) {
    console.error("Error retrieving data:", e);
  }
}

async function Get(url: string, query?: Record<string, any>) {
  const headers = getHeaders();

  return handleResponse(
    await cubeApiAxiosConfig.get(`${ScryfallURL}/${url}`, {
      headers,
      params: query,
    })
  );
}

async function Post(url: string, data?: Record<string, any>) {
  const headers = getHeaders();

  return handleResponse(
    await cubeApiAxiosConfig.post(`${ScryfallURL}/${url}`, {
      headers,
      ...data,
    })
  );
}

const Api = {
  get: Get,
  post: Post,
};

export default Api;

interface CubeApiCard {
  model: string; // reference to Django model name
  pk: number; // card primary key
  name: string;
  scryfall_id: string;
  deck: number; // deck primary key, this being required means every card in our database must belong to a deck
}

export async function saveDeck(name: string, cards: Card[]) {
  cubeApiAxiosConfig
    .post(
      DECK_ENDPOINT,
      { name: name, cards: cards },
      {
        withCredentials: true,
      }
    )
    .then((response) => console.log("saveDeck response: ", response))
    .catch((error) => {});
}

export async function getDeck(id: number) {
  cubeApiAxiosConfig
    .get(DECK_ENDPOINT, { params: { id: id } })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log("error in cube", error);
    });
}

export async function loginUser(username: string, password: string) {
  axios
    .post(LOGIN_ENDPOINT, {
      username: username,
      password: password,
    })
    .then((response) => {
      if (response.data?.access && response.data?.refresh) {
        console.log(`user logged in`);
        // query for user information to set context ?
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
      }
    })
    .catch((error) => console.log(`Error logging in: ${error}`));
}

export async function registerUser(username: string, password: string) {
  axios
    .post(REGISTER_USER_ENDPOINT, {
      username: username,
      password: password,
    })
    .then((response) => {
      console.log(`User with username: ${username} created, logging in now.`);
      loginUser(username, password);
    })
    .catch((error) => {
      console.log(error.response?.data?.username[0]);
    });
}

const REFRESH_TOKEN_BLACKLIST: string[] = [
  LOGIN_ENDPOINT,
  REGISTER_USER_ENDPOINT,
];

// add authentication tokens to each api request
cubeApiAxiosConfig.interceptors.request.use(
  (config) => {
    console.log(config.url);
    const access_token = getLocalStorageJwt()?.access;
    if (access_token) {
      config.headers["Authorization"] = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// refresh access token upon expiry, logout users with expired refresh token
cubeApiAxiosConfig.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalRequest = err.config;

    // Access Token was expired
    if (
      !REFRESH_TOKEN_BLACKLIST.includes(originalRequest.url) &&
      err.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          REFRESH_ACCESS_ENDPOINT,
          { refresh: getLocalStorageJwt()?.refresh },
          {
            headers: getCubeApiHeaders(),
            withCredentials: true,
          }
        );
        // don't use axios instance that already configured for refresh token api call
        const newAccessToken = response.data.access;

        localStorage.setItem("access", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest); //recall Api with new token
      } catch (error) {
        // Handle token refresh failure - session has expired (configured in Django)
        removeLocalStorageJwt();
      }
    }

    return;
  }
);
