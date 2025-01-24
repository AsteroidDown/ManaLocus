import { User } from "@/models/user/user";
import { createContext } from "react";

const UserContext = createContext({
  user: null as User | null,
  setUser: (user: User | null) => {},
});

export default UserContext;
