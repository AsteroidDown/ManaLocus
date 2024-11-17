import { ApiUrl } from "@/constants/urls";
import axios from "axios";

const APIAxiosConfig = axios.create({
  baseURL: ApiUrl,
  headers: {
    "Content-Type": "application/json", // change according header type accordingly
  },
});

export default APIAxiosConfig;
