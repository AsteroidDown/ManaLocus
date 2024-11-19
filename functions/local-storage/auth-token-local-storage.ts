import { JWT } from "@/models/auth/jwt";
import { Platform } from "react-native";

export function getLocalStorageJwt(): JWT | null {
  if (Platform.OS === "ios") return null;

  const jwt: JWT = {
    access: localStorage.getItem("user-access") || "",
    refresh: localStorage.getItem("user-refresh") || "",
  };

  return jwt;
}

export function removeLocalStorageJwt(): void {
  localStorage.removeItem("user-access");
  localStorage.removeItem("user-refresh");
}
