import axios, { AxiosResponse } from "axios";
import { ScryfallURL } from "../../constants/urls";

function getHeaders() {
  return {
    // "User-Agent": "ChromaticCube/1.0",
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
    await axios.get(`${ScryfallURL}/${url}`, {
      headers,
      params: query,
    })
  );
}

async function post(url: string, data?: Record<string, any>) {
  const headers = getHeaders();

  return handleResponse(
    await axios.post(`${ScryfallURL}/${url}`, {
      headers,
      ...data,
    })
  );
}

const ScryfallAPI = {
  get,
  post,
};

export default ScryfallAPI;
