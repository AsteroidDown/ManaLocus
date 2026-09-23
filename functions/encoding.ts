function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

function base64ToBytes(data: string): Uint8Array {
  return Uint8Array.from(atob(data), (char) => char.charCodeAt(0));
}

export function encode(data: string, prefix = "") {
  return bytesToBase64(
    new TextEncoder().encode(`${prefix ? `${prefix}_` : ""}${data}`)
  );
}

export function decode(data: string, prefix = "") {
  if (typeof data !== "string" || typeof prefix !== "string") {
    throw new TypeError("Invalid parameters for decode()");
  }

  return new TextDecoder()
    .decode(base64ToBytes(data))
    .split(`${prefix ? `${prefix}_` : ""}`)[prefix ? 1 : 0];
}
