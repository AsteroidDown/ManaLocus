import { User } from "@/models/user/user";
import { Platform } from "react-native";
import { decode, encode } from "../encoding";

export type UserDetails = User & {
  password: string;
  lastLogin: Date;
};

export function getLocalStorageUser(): UserDetails | null {
  if (Platform.OS === "ios") return null;

  const user = localStorage.getItem("user-details");
  if (!user) return null;

  const savedUser = JSON.parse(user) as UserDetails;
  savedUser.password = decode(savedUser.password);

  return savedUser;
}

export function setLocalStorageUser(user: User, password: string) {
  localStorage.setItem(
    "user-details",
    JSON.stringify({
      ...user,
      password: encode(password, user.name),
      lastLogin: new Date(),
    })
  );
}

export function updateLocalStorageUser(user: User, password?: string) {
  const savedUser = getLocalStorageUser();
  if (!savedUser) return;

  localStorage.setItem(
    "user-details",
    JSON.stringify({
      ...user,
      password: password ? encode(password, user.name) : savedUser.password,
    })
  );
}

export function removeLocalStorageUser(): void {
  localStorage.removeItem("user-details");
}
