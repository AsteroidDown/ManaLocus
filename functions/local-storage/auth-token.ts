import { JWT } from "@/models/auth/jwt";
import { Platform } from "react-native";

export function getLocalStorageJwt(): JWT | null {
  if (Platform.OS === "ios") return null;

  const jwt: JWT = {
    access: localStorage.getItem("access") || "",
    refresh: localStorage.getItem("refresh") || "",
  };

  return jwt;
}

export function removeLocalStorageJwt(): void {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}
