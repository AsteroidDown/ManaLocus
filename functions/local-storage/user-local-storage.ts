import { getAccess } from "@/models/user/access";
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

  if (!savedUser.name || !savedUser.password) {
    removeLocalStorageUser();
    return null;
  }

  try {
    savedUser.password = decode(savedUser.password, savedUser.name);
  } catch (err) {
    console.error("Failed to decode password:", err);
    removeLocalStorageUser();
    return null;
  }

  return savedUser;
}

export function setLocalStorageUser(user: User, password: string) {
  localStorage.setItem(
    "user-details",
    JSON.stringify({
      ...user,
      lastLogin: new Date(),
      access: getAccess(user),
      password: encode(password, user.name),
    })
  );
}

export function updateLocalStorageUser(user: User, password?: string) {
  const savedUser = getLocalStorageUser();
  if (!savedUser) return;

  const encodedPassword =
    password !== undefined
      ? encode(password, user.name)
      : encode(savedUser.password, user.name);

  localStorage.setItem(
    "user-details",
    JSON.stringify({
      ...user,
      access: getAccess(user),
      password: encodedPassword,
      lastLogin: savedUser.lastLogin ?? new Date(),
    })
  );
}

export function removeLocalStorageUser(): void {
  localStorage.removeItem("user-details");
}
