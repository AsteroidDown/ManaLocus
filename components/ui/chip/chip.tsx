import Text from "@/components/ui/text/text";
import { MTGColor } from "@/constants/mtg/mtg-colors";
import { ActionColor } from "@/constants/ui/colors";
import { Size } from "@/constants/ui/sizes";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pressable, ViewProps } from "react-native";

export type ChipType = "default" | "outlined";

export type ChipProps = ViewProps & {
  text?: string;
  type?: ChipType;
  size?: Size;
  action?: ActionColor | MTGColor;
  disabled?: boolean;

  startIcon?: IconProp;
  endIcon?: IconProp;

  onClick?: () => void;
};

export default function Chip({
  text,
  type = "default",
  size = "md",
  action = "primary",
  disabled = false,
  startIcon,
  endIcon,
  onClick,
  style,
  className,
  children,
}: ChipProps) {
  const baseColor = getChipBaseColor(action, type, disabled);
  const hoverColor = getChipHoverColor(action, type, disabled);
  const textColor = getChipTextColor(action, type, disabled);

  const chipHeight = getChipHeight(size);

  const baseChipClasses =
    "flex flex-row px-4 py-2 gap-2 justify-center items-center rounded-full transition-all";

  return (
    <Pressable
      style={style}
      className={`${className} ${baseChipClasses} ${baseColor} ${hoverColor} ${chipHeight}`}
      onPress={onClick}
    >
      {startIcon && (
        <FontAwesomeIcon
          icon={startIcon}
          className={`${textColor}`}
          size={size !== "md" ? size : undefined}
        />
      )}

      {text && (
        <Text noWrap size={size} weight="bold" className={`${textColor}`}>
          {text}
        </Text>
      )}

      {children}

      {endIcon && (
        <FontAwesomeIcon
          icon={endIcon}
          className={`${textColor}`}
          size={size !== "md" ? size : undefined}
        />
      )}
    </Pressable>
  );
}

function getChipBaseColor(
  action: ActionColor | MTGColor,
  type: ChipType,
  disabled: boolean
) {
  if (type === "outlined") {
    if (disabled) return "border-2 border-dark-200";

    return (
      "border-2 " +
      (action === "primary"
        ? "border-primary-300"
        : action === "secondary"
        ? "border-secondary-200"
        : action === "success"
        ? "border-success-200"
        : action === "danger"
        ? "border-danger-200"
        : action === "info"
        ? "border-info-200"
        : action === "warning"
        ? "border-warning-200"
        : action === "white"
        ? "border-mtg-white-secondary"
        : action === "blue"
        ? "border-mtg-blue-secondary"
        : action === "black"
        ? "border-mtg-black-secondary"
        : action === "red"
        ? "border-mtg-red-secondary"
        : action === "green"
        ? "border-mtg-green-secondary"
        : action === "gold"
        ? "border-mtg-gold-secondary"
        : action === "colorless"
        ? "border-mtg-colorless-secondary"
        : "border-mtg-blue-secondary")
    );
  } else {
    if (disabled) return "border-2 bg-dark-300";

    return (
      "border-2 border-transparent " +
      (action === "primary"
        ? "bg-primary-300"
        : action === "secondary"
        ? "bg-secondary-200"
        : action === "success"
        ? "bg-success-200"
        : action === "danger"
        ? "bg-danger-200"
        : action === "info"
        ? "bg-info-200"
        : action === "warning"
        ? "bg-warning-200"
        : action === "white"
        ? "bg-mtg-white-secondary"
        : action === "blue"
        ? "bg-mtg-blue-secondary"
        : action === "black"
        ? "bg-mtg-black-secondary"
        : action === "red"
        ? "bg-mtg-red-secondary"
        : action === "green"
        ? "bg-mtg-green-secondary"
        : action === "gold"
        ? "bg-mtg-gold-secondary"
        : action === "colorless"
        ? "bg-mtg-colorless-secondary"
        : "bg-mtg-blue-secondary")
    );
  }
}

function getChipHoverColor(
  action: ActionColor | MTGColor,
  type: ChipType,
  disabled: boolean
) {
  if (disabled) return;

  return `${type !== "default" ? "hover:bg-opacity-30" : ""} ${
    action === "primary"
      ? "hover:bg-primary-200"
      : action === "secondary"
      ? "hover:bg-secondary-100"
      : action === "success"
      ? "hover:bg-success-100"
      : action === "danger"
      ? "hover:bg-danger-100"
      : action === "info"
      ? "hover:bg-info-100"
      : action === "warning"
      ? "hover:bg-warning-100"
      : action === "white"
      ? "hover:bg-mtg-white"
      : action === "blue"
      ? "hover:bg-mtg-blue"
      : action === "black"
      ? "hover:bg-mtg-black"
      : action === "red"
      ? "hover:bg-mtg-red"
      : action === "green"
      ? "hover:bg-mtg-green"
      : action === "gold"
      ? "hover:bg-mtg-gold"
      : action === "colorless"
      ? "hover:bg-mtg-colorless"
      : "hover:bg-mtg-blue"
  }`;
}

function getChipTextColor(
  action: ActionColor | MTGColor,
  type: ChipType,
  disabled: boolean
) {
  if (disabled) return "!text-dark-600";

  return `${
    type === "default"
      ? "!text-dark-100"
      : action === "primary"
      ? "!text-primary-200"
      : action === "secondary"
      ? "!text-secondary-100"
      : action === "success"
      ? "!text-success-100"
      : action === "danger"
      ? "!text-danger-100"
      : action === "info"
      ? "!text-info-100"
      : action === "warning"
      ? "!text-warning-100"
      : action === "white"
      ? "!text-mtg-white"
      : action === "blue"
      ? "!text-mtg-blue"
      : action === "black"
      ? "!text-mtg-black"
      : action === "red"
      ? "!text-mtg-red"
      : action === "green"
      ? "!text-mtg-green"
      : action === "gold"
      ? "!text-mtg-gold"
      : action === "colorless"
      ? "!text-mtg-colorless"
      : "!text-mtg-blue"
  }`;
}

function getChipHeight(size: Size) {
  return size === "xs"
    ? "h-6"
    : size === "sm"
    ? "h-8"
    : size === "md"
    ? "h-10"
    : size === "lg"
    ? "h-12"
    : "h-14";
}
