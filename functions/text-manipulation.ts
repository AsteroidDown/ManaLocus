export function titleCase(text?: string) {
  return text?.length
    ? text
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.substring(1).toLowerCase())
        .join(" ")
    : "";
}

export function currency(value?: number | null) {
  if (!value) return "$0.00";

  if (typeof value !== "number") {
    const valueNumber = Number(value);
    if (isNaN(valueNumber)) return "$0.00";

    return "$" + valueNumber.toFixed(2);
  }

  return "$" + value.toFixed(2);
}
