import { APIbaseURL } from "@/constants/urls";
import {
  getLocalStorageJwt,
  removeLocalStorageJwt,
} from "@/functions/local-storage/auth-token-local-storage";
import axios from "axios";
import APIAxiosConfig from "../api-methods/api-methods";

const baseURL = `${APIbaseURL}/api/token`;

const LOGIN = `${baseURL}/login`;
const REGISTER = `${baseURL}/register`;
const REFRESH = `${baseURL}/refresh`;

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
  (error) => {
    return Promise.reject(error);
  }
);

// Refresh access token upon expiry, logout users with expired refresh token
APIAxiosConfig.interceptors.response.use(
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
          REFRESH,
          { refresh: getLocalStorageJwt()?.refresh },
          {
            headers: getApiHeaders(),
            withCredentials: true,
          }
        );

        // Don't use axios instance that already configured for refresh token api call
        const newAccessToken = response.data.access;

        localStorage.setItem("access", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest); //recall Api with new token
      } catch (error) {
        // Handle token refresh failure - user session has expired (configured in Django)
        removeLocalStorageJwt();
      }
    }
  }
);
