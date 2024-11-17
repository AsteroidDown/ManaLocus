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
