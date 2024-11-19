import { User } from "@/models/user/user";
import API from "../api-methods/api-methods";

async function getCurrentUser(): Promise<User | null> {
  return await API.get(`users/current/`)
    .then(
      (response) =>
        ({
          id: response.id,
          name: response.username,
          email: response.email,
        } as User)
    )
    .catch((error) => {
      console.log(`Error retrieving current user: ${error}`);
      return null;
    });
}

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
      if (response?.access && response?.refresh) {
        localStorage.setItem("user-access", response.access);
        localStorage.setItem("user-refresh", response.refresh);
      }

      return {
        id: response?.id,
        name: response?.name,
        email: response?.email,
      };
    })
    .catch((error) => console.log(`Error logging in: ${error}`));
}

const UserService = {
  getCurrentUser,
  register,
  login,
};

export default UserService;
