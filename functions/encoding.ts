import { Buffer } from "buffer";

export function encode(data: string, prefix = "") {
  return Buffer.from(`${prefix ? `${prefix}_` : ""}${data}`, "utf8").toString(
    "base64"
  );
}

export function decode(data: string, prefix = "") {
  return Buffer.from(data, "base64")
    .toString("utf8")
    .split(`${prefix ? `${prefix}_` : ""}`)[prefix ? 1 : 0];
}
