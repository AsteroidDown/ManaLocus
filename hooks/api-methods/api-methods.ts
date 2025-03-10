import {
  getLocalStorageJwt,
  removeLocalStorageJwt,
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
  (res) => res,
  async (err) => {
    console.log("Response Error");
    console.log(err);
    const originalRequest = err.config;

    // Access Token was expired
    if (
      !REFRESH_TOKEN_BLACKLIST.includes(originalRequest.url) &&
      err.response?.status === 401 &&
      !originalRequest._retry
    ) {
      console.log("Refreshing Token");
      originalRequest._retry = true;

      try {
        const refresh = getLocalStorageJwt()?.refresh;
        console.log("Current Token", refresh);
        if (!refresh) return;

        const response = await axios.post(
          REFRESH,
          { refresh },
          {
            headers: getApiHeaders(),
            withCredentials: true,
          }
        );
        console.log("New Token", response);

        // Don't use axios instance that already configured for refresh token api call
        const newAccessToken = response.data.access;

        console.log("Setting New Token", newAccessToken);
        localStorage.setItem("user-access", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        console.log("Recalling Request");
        return axios(originalRequest); //recall Api with new token
      } catch (error) {
        console.log("Error Refreshing Token", error);
        // Handle token refresh failure - user session has expired (configured in Django)
        removeLocalStorageJwt();
      }
    }
  }
);
