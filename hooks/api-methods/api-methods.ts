import {
  getLocalStorageJwt,
  removeLocalStorageJwt,
  setLocalStorageJwt,
} from "@/functions/local-storage/auth-token-local-storage";
import axios, { AxiosResponse } from "axios";
import { APIbaseURL } from "../../constants/urls";

const baseURL = `${APIbaseURL}/api`;

const APIAxiosConfig = axios.create({
  baseURL: `${APIbaseURL}/api`,
  headers: {
    "Content-Type": "application/json", // change according header type accordingly
  },
});

async function handleResponse(response: AxiosResponse<any, any>) {
  try {
    return response.data;
  } catch (e) {
    console.error("Error retrieving data:", e);
  }
}

async function get(url: string, query?: Record<string, any>) {
  return handleResponse(
    await APIAxiosConfig.get(`${baseURL}/${url}`, {
      params: query,
    })
  );
}

async function post(
  url: string,
  data?: Record<string, any>,
  secured?: boolean
) {
  return handleResponse(
    await APIAxiosConfig.post(`${baseURL}/${url}`, {
      ...data,
      ...(secured ? { withCredentials: true } : {}),
    })
  );
}

async function patch(
  url: string,
  data?: Record<string, any>,
  secured?: boolean
) {
  return handleResponse(
    await APIAxiosConfig.patch(`${baseURL}/${url}`, {
      ...data,
      ...(secured ? { withCredentials: true } : {}),
    })
  );
}

async function remove(url: string, secured?: boolean) {
  return handleResponse(
    await APIAxiosConfig.delete(`${baseURL}/${url}`, {
      ...(secured ? { withCredentials: true } : {}),
    })
  );
}

const API = {
  get,
  post,
  patch,
  delete: remove,
};

export default API;

const LOGIN = `${baseURL}/login`;
const REGISTER = `${baseURL}/register`;
const REFRESH = `${baseURL}/token/refresh/`;

const REFRESH_TOKEN_BLACKLIST: string[] = [LOGIN, REGISTER];

function getApiHeaders() {
  return {
    "Content-Type": "application/json",
  };
}

// Add authentication tokens to each api request
APIAxiosConfig.interceptors.request.use(
  (config) => {
    const access_token = getLocalStorageJwt()?.access;

    if (access_token) {
      config.headers["Authorization"] = `Bearer ${access_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh access token upon expiry, logout users with expired refresh token
APIAxiosConfig.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = getLocalStorageJwt()?.refresh;

    if (
      error.response &&
      error.response.status === 401 &&
      error.config &&
      !error.config.__isRetryRequest &&
      refreshToken
    ) {
      try {
        originalRequest._retry = true;

        const response = await fetch(REFRESH, {
          method: "POST",
          headers: getApiHeaders(),
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        }).then((res) => res.json());

        const access = response.access;
        if (!access) {
          removeLocalStorageJwt();
          return Promise.reject(error);
        }

        setLocalStorageJwt({ access, refresh: refreshToken });

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axios(originalRequest);
      } catch (err) {
        console.error("Error Refreshing Token", err);
        removeLocalStorageJwt();
        return Promise.reject(err);
      }
    }
  }
);
