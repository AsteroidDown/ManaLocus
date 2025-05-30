import axios, { AxiosResponse } from "axios";
import { SpellbookURL } from "../../constants/urls";

function getHeaders() {
  return {
    // "User-Agent": "Mana Locus/1.0",
    Accept: "*/*",
  };
}

async function handleResponse(response: AxiosResponse<any, any>) {
  try {
    return response.data;
  } catch (e) {
    console.error("Error retrieving data:", e);
  }
}

async function get(url: string, query?: Record<string, any>) {
  const headers = getHeaders();

  return handleResponse(
    await axios.get(`${SpellbookURL}/${url}`, {
      headers,
      params: query,
    })
  );
}

async function post(url: string, data?: Record<string, any>) {
  const headers = getHeaders();

  return handleResponse(
    await axios.post(`${SpellbookURL}/${url}`, {
      headers,
      ...data,
    })
  );
}

const SpellbookAPI = {
  get,
  post,
};

export default SpellbookAPI;
