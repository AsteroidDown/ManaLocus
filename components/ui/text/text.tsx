import { ActionColor } from "@/constants/ui/colors";
import { Size } from "@/constants/ui/sizes";
import { Text as ReactText, ViewProps } from "react-native";

export type TextThickness =
  | "thin"
  | "light"
  | "normal"
  | "medium"
  | "semi"
  | "bold";

export type TextProps = ViewProps & {
  size?: Size;
  action?: ActionColor | "default";
  weight?: TextThickness;
  mono?: boolean;
  center?: boolean;
  noWrap?: boolean;
  truncate?: boolean;
};

export default function Text({
  size = "sm",
  action = "default",
  weight = "normal",
  mono = false,
  center = false,
  noWrap = false,
  truncate = false,
  className,
  children,
}: TextProps) {
  const textSize = getTextSize(size);
  const textColor = getTextColor(action);
  const textWeight = getTextThickness(weight);

  return (
    <ReactText
      className={`${className} ${textSize} ${textColor} ${textWeight} ${
        mono ? "font-mono" : ""
      } ${noWrap ? "text-nowrap" : ""} ${truncate ? "truncate" : ""} ${
        center ? "text-center" : ""
      }`}
    >
      {children}
    </ReactText>
  );
}

function getTextSize(size: Size) {
  return size === "xs"
    ? "text-xs"
    : size === "sm"
    ? "text-sm"
    : size == "lg"
    ? "text-lg"
    : size === "xl"
    ? "text-xl"
    : size === "2xl"
    ? "text-2xl"
    : "text-base";
}

function getTextColor(action: ActionColor | "default") {
  return action === "default"
    ? "text-white"
    : action === "primary"
    ? "text-primary-200"
    : action === "secondary"
    ? "text-secondary-100"
    : action === "success"
    ? "text-success-100"
    : action === "danger"
    ? "text-danger-100"
    : action === "info"
    ? "text-info-100"
    : "text-warning-100";
}

function getTextThickness(thickness: TextThickness) {
  return thickness === "thin"
    ? "font-thin"
    : thickness === "light"
    ? "font-light"
    : thickness === "medium"
    ? "font-medium"
    : thickness === "semi"
    ? "font-semibold"
    : thickness === "bold"
    ? "font-bold"
    : "font-normal";
}
