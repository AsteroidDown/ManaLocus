import axios from "axios";

async function register(username: string, password: string) {
  return await axios
    .post(`users/register/`, {
      username: username,
      password: password,
    })
    .catch((error) => {
      console.log(error.response?.data?.username[0]);
    });
}

async function login(username: string, password: string) {
  return await axios
    .post(`users/login/`, {
      username: username,
      password: password,
    })
    .then((response) => {
      if (response.data?.access && response.data?.refresh) {
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
