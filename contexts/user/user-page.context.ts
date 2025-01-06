import { User } from "@/models/user/user";
import { createContext } from "react";

const UserPageContext = createContext({
  userPageUser: null as User | null,
  setPageUser: (user: User | null) => {},
});

export default UserPageContext;
