import { Buffer } from "buffer";

export function encode(data: string, prefix = "") {
  return Buffer.from(`${prefix ? `${prefix}_` : ""}${data}`, "utf8").toString(
    "base64"
  );
}

export function decode(data: string, prefix = "") {
  if (typeof data !== "string" || typeof prefix !== "string") {
    throw new TypeError("Invalid parameters for decode()");
  }

  return Buffer.from(data, "base64")
    .toString("utf8")
    .split(`${prefix ? `${prefix}_` : ""}`)[prefix ? 1 : 0];
}
