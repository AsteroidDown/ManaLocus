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
  return "$" + value.toFixed(2);
}
