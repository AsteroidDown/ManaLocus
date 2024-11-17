import { ApiUrl } from "@/constants/urls";
import axios from "axios";

const baseURL = `${ApiUrl}/api/token`;

async function register(username: string, password: string) {
  axios
    .post(`${baseURL}/register`, {
      username: username,
      password: password,
    })
    .then((response) => {
      console.log(`User with username: ${username} created, logging in now.`);
      login(username, password);
    })
    .catch((error) => {
      console.log(error.response?.data?.username[0]);
    });
}

async function login(username: string, password: string) {
  axios
    .post(`${baseURL}/login`, {
      username: username,
      password: password,
    })
    .then((response) => {
      if (response.data?.access && response.data?.refresh) {
        console.log(`user logged in`);

        // TODO: Set user context
        localStorage.setItem("user-access", response.data.access);
        localStorage.setItem("user-refresh", response.data.refresh);
      }
    })
    .catch((error) => console.log(`Error logging in: ${error}`));
}

const UserService = {
  register,
  login,
};

export default UserService;
