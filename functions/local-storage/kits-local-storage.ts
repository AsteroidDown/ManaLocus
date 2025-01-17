import { Deck } from "@/models/deck/deck";
import { Platform } from "react-native";

export function getLocalStorageKits(): Deck[] {
  if (Platform.OS === "ios") return [];

  const kits: Deck[] = JSON.parse(localStorage.getItem("builderKits") || "[]");

  return kits;
}

export function setLocalStorageKits(kits: Deck[]) {
  localStorage.setItem("builderKits", JSON.stringify(kits));
}

export function addLocalStorageKit(kit: Deck) {
  let storedKits = getLocalStorageKits();

  if (!storedKits.map((storedKit) => storedKit.id).includes(kit.id)) {
    storedKits.push(kit);
    setLocalStorageKits(storedKits);
  }
}

export function removeLocalStorageKit(kit: Deck) {
  let storedKits = getLocalStorageKits();

  const index = storedKits.findIndex((storedKit) => storedKit.id === kit.id);
  if (index >= 0) storedKits.splice(index, 1);

  setLocalStorageKits(storedKits);
}
