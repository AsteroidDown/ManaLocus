import Text from "@/components/ui/text/text";
import { ActionColor } from "@/constants/ui/colors";
import { Size } from "@/constants/ui/sizes";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { Pressable, View, ViewProps } from "react-native";

export type ButtonType = "default" | "outlined" | "clear";

export type ButtonProps = ViewProps & {
  text?: string;
  icon?: IconProp;
  buttonClasses?: string;
  iconRight?: boolean;
  action?: ActionColor;
  size?: Size;
  type?: ButtonType;
  rounded?: boolean;
  square?: boolean;

  start?: boolean;

  squareLeft?: boolean;
  squareRight?: boolean;
  hideLeftBorder?: boolean;
  hideRightBorder?: boolean;

  disabled?: boolean;
  tabbable?: boolean;
  stopPropagation?: boolean;
  onClick?: () => void;
};

export default function Button({
  text,
  icon,
  buttonClasses,
  className,
  iconRight = false,
  action = "primary",
  size = "md",
  type = "default",
  disabled = false,
  tabbable = true,
  stopPropagation = false,
  onClick,
  children,
  start = false,
  rounded = false,
  square = false,
  squareLeft = false,
  squareRight = false,
  hideLeftBorder = false,
  hideRightBorder = false,
}: ButtonProps) {
  const [focused, setFocused] = React.useState(false);
  const [useFocus, setUseFocus] = React.useState(false);

  const ref = React.useRef<View>(null);

  const baseColor = getButtonBaseColor(action, type, disabled);
  const hoverColor = getButtonHoverColor(action, type, disabled);
  const textColor = getButtonTextColor(action, type, disabled);
  const focusColor = getButtonFocusColor(action, type, disabled);

  const buttonHeight = getButtonHeight(size);

  const baseButtonClasses =
    "flex flex-row px-4 py-2 items-center w-full rounded-md transition-all " +
    (start ? "justify-start" : "justify-center") +
    (square ? " !rounded-none" : "");

  useEffect(() => {
    if (focused) {
      ref.current?.focus();
      setUseFocus(true);
    } else {
      ref.current?.blur();
      setUseFocus(false);
    }
  }, [focused]);

  return (
    <Pressable
      onPress={(event) => {
        onClick?.();
        setFocused(false);

        if (stopPropagation) event.stopPropagation();
      }}
      disabled={disabled}
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      className={`${className} outline-none`}
      tabIndex={disabled ? -1 : tabbable ? 0 : -1}
    >
      <View
        ref={ref}
        className={`${buttonClasses} ${baseButtonClasses} ${buttonHeight}
          ${baseColor} ${hoverColor} ${useFocus ? focusColor : ""} ${
          rounded && text
            ? "!rounded-full"
            : rounded
            ? "!rounded-full !w-10 !h-10"
            : ""
        } ${hideLeftBorder ? "!border-l-0" : ""} ${
          hideRightBorder ? "!border-r-0" : ""
        } ${squareLeft ? "!rounded-l-none" : ""} ${
          squareRight ? "!rounded-r-none" : ""
        }`}
      >
        {icon && !iconRight && (
          <FontAwesomeIcon
            icon={icon}
            className={`${textColor} ${text || children ? "mr-2" : ""} ${
              icon === faRotate ? "animate-spin" : ""
            }`}
            size={size !== "md" ? size : undefined}
          />
        )}

        {text && (
          <Text
            thickness="bold"
            size={size}
            className={`${textColor} ${children ? "mr-2" : ""} select-none`}
          >
            {text}
          </Text>
        )}

        {children}

        {icon && iconRight && (
          <FontAwesomeIcon
            icon={icon}
            className={`${textColor} ${
              children || text ? "pl-2" : ""
            } ml-auto select-none`}
            size={size !== "md" ? size : undefined}
          />
        )}
      </View>
    </Pressable>
  );
}

function getButtonBaseColor(
  action: ActionColor,
  type: ButtonType,
  disabled: boolean
) {
  if (type === "clear") return "border-2 border-transparent";
  else if (type === "outlined") {
    if (disabled) return "border-2 bg-dark-300 bg-opacity-30";

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
        : "border-white")
    );
  } else {
    if (disabled) return "bg-dark-300";

    return (
      (action === "primary"
        ? "bg-primary-300 border-primary-300"
        : action === "secondary"
        ? "bg-secondary-200 border-secondary-200"
        : action === "success"
        ? "bg-success-200 border-success-200"
        : action === "danger"
        ? "bg-danger-200 border-danger-200"
        : action === "info"
        ? "bg-info-200 border-info-200"
        : action === "warning"
        ? "bg-warning-200 border-warning-200"
        : "bg-white bg-opacity-30") + " border-2"
    );
  }
}

function getButtonHoverColor(
  action: ActionColor,
  type: ButtonType,
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
      : "hover:bg-white"
  }`;
}

function getButtonFocusColor(
  action: ActionColor,
  type: ButtonType,
  disabled: boolean
) {
  if (disabled) return;

  return `${type !== "default" ? "bg-opacity-30" : "border-2 bg-opacity-60"} ${
    action === "primary"
      ? "bg-primary-100 border-primary-300"
      : action === "secondary"
      ? "bg-secondary-100 border-secondary-300"
      : action === "success"
      ? "bg-success-100 border-success-300"
      : action === "danger"
      ? "bg-danger-100 border-danger-300"
      : action === "info"
      ? "bg-info-100 border-info-300"
      : action === "warning"
      ? "bg-warning-100 border-warning-300"
      : "bg-white"
  }`;
}

function getButtonTextColor(
  action: ActionColor,
  type: ButtonType,
  disabled: boolean
) {
  if (disabled) return "text-dark-600";

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
      : "!text-white"
  }`;
}

function getButtonHeight(size: Size) {
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
