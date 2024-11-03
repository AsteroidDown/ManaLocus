import axios, { AxiosResponse } from "axios";
import {
  CubeApiUrl,
  ScryfallURL,
} from "../constants/urls";
import { getLocalStorageJwt, removeLocalStorageJwt } from "@/functions/local-storage/auth-token";
import { Card } from "@/models/card/card";

function getHeaders() {
  return {
    // "User-Agent": "ChromaticCube/1.0",
    Accept: "*/*",
  };
}

function getCubeApiHeaders() {
  const access_token = getLocalStorageJwt()?.access;
  return {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };
}

async function handleResponse(response: AxiosResponse<any, any>) {
  try {
    return response.data;
  } catch (e) {
    console.error("Error retrieving data:", e);
  }
}

async function Get(url: string, query?: Record<string, any>) {
  const headers = getHeaders();

  return handleResponse(
    await axios.get(`${ScryfallURL}/${url}`, {
      headers,
      params: query,
    })
  );
}

async function Post(url: string, data?: Record<string, any>) {
  const headers = getHeaders();

  return handleResponse(
    await axios.post(`${ScryfallURL}/${url}`, {
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
  model: string,  // reference to Django model name
  pk: number,     // card primary key
  name: string,
  scryfall_id: string, 
  deck: number    // deck primary key, this being required means every card in our database must belong to a deck
}

/**
 * Uses the JWT refresh token to generate a new access token.
 * @param callbackOnSuccess presumably a function tried to do something but couldn't because the access token was expired. 
 * Provide this function as a callback to repeat calling it after a new access token is issued
 * @param callbackParams the parameters to pass to callbackOnSuccess
 */
async function refreshAccessToken(callbackOnSuccess: Function, ...callbackParams: any[]) {
  axios
    .post(
      `${CubeApiUrl}api/token/refresh/`,
      { refresh: getLocalStorageJwt()?.refresh},
      {
        headers: getCubeApiHeaders(),
        withCredentials: true,
      }
    )
    .then((response) => {

      localStorage.setItem("access", response.data.access);

      callbackOnSuccess(...callbackParams);
    })
    .catch((error) => {
      if (error.response.status == 401) {
        console.log("Refresh token expired. Redirect to login page.", error.response.data);
        removeLocalStorageJwt();
      }
    });
}

export async function saveDeck(name: string, cards: Card[]) {
  console.log("Call saveDeck cards: ", cards)
  axios
    .post(
      `${CubeApiUrl}api/deck/`,
      { name: name, cards: cards },
      {
        headers: getCubeApiHeaders(),
        withCredentials: true,
      }
    )
    .then((response) => console.log("saveDeck response: ", response))
    .catch((error) => {
      if (error.response.status == 401) {
        refreshAccessToken(saveDeck, name, cards);
      }
    });
}

export async function getDeck(id: number) {
  axios
    .get(`${CubeApiUrl}api/deck/`, {
      params: {
        id: id,
      },
      headers: getCubeApiHeaders(),
      withCredentials: true,
    })
    .then((response) => console.log("Deck of cards:", response))
    .catch((error) => {
      if (error.response.status == 401) {
        refreshAccessToken(getDeck, id);
      }
      console.log(error.response.data)
    });
}

export async function loginUser(username: string, password: string) {
  axios
    .post(`${CubeApiUrl}api/token/`, {
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
    .post(`${CubeApiUrl}api/user/register/`, {
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
