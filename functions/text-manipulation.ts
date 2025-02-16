export function titleCase(text?: string) {
  return text?.length
    ? text
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.substring(1).toLowerCase())
        .join(" ")
    : "";
}

export function currency(value?: number | null, euro = false) {
  const symbol = euro ? "€" : "$";
  if (!value) return symbol + "0.00";

  const negative = value < 0;
  if (negative) value *= -1;

  if (typeof value !== "number") {
    const valueNumber = Number(value);
    if (isNaN(valueNumber)) return symbol + "0.00";

    return (negative ? "-" : "") + symbol + valueNumber.toFixed(2);
  }

  return (negative ? "-" : "") + symbol + value.toFixed(2);
}
