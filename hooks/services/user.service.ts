import { User } from "@/models/user/user";
import API from "../api-methods/api-methods";

async function getCurrentUser(): Promise<User | null> {
  if (!localStorage.getItem("user-access")) return null;

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

async function logout() {
  localStorage.removeItem("user-access");
  localStorage.removeItem("user-refresh");

  return await API.delete(`users/logout/`).catch((error) =>
    console.log(`Error logging out: ${error}`)
  );
}

const UserService = {
  getCurrentUser,
  register,
  login,
  logout,
};

export default UserService;
