import { User } from "@/models/user/user";
import API from "../api-methods/api-methods";

async function register(
  username: string,
  password: string,
  email: string
): Promise<User> {
  return await API.post(`users/register/`, {
    username: username,
    password: password,
    email: email,
  }).catch((error) => console.log(`Error registering user: ${error}`));
}

async function login(username: string, password: string) {
  return await API.post(`users/login/`, {
    username: username,
    password: password,
  })
    .then((response) => {
      if (response.data?.access && response.data?.refresh) {
        localStorage.setItem("user-access", response.data.access);
        localStorage.setItem("user-refresh", response.data.refresh);
      }

      return response;
    })
    .catch((error) => console.log(`Error logging in: ${error}`));
}

const UserService = {
  register,
  login,
};

export default UserService;
