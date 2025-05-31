import { PreferenceColor } from "@/constants/ui/colors";
import { Size } from "@/constants/ui/sizes";
import UserPreferencesContext from "@/contexts/user/user-preferences.context";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useState } from "react";
import { Pressable, View, ViewProps } from "react-native";
import Icon from "../icon/icon";
import Text from "../text/text";

export interface CheckboxProps extends ViewProps {
  label?: string;
  text?: string;

  size?: Size;
  disabled?: boolean;

  checked?: boolean;
  onChange: (checked: boolean) => void;
}

export default function Checkbox({
  label,
  text,
  size,
  disabled,
  className,
  checked,
  onChange,
}: CheckboxProps) {
  const { preferences } = useContext(UserPreferencesContext);

  const [hovered, setHovered] = useState(false);

  const darkText =
    preferences?.color &&
    [
      PreferenceColor.LIME,
      PreferenceColor.YELLOW,
      PreferenceColor.PINK,
      PreferenceColor.TEAL,
    ].includes(preferences?.color)
      ? true
      : false;

  return (
    <Pressable
      className={`flex-1 flex flex-row items-center gap-2 max-h-fit z-[-1] min-w-fit outline-none ${className}`}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPress={() => !disabled && onChange?.(!checked)}
    >
      <View
        className={`${hovered ? "bg-primary-300 border-primary-200" : ""} ${
          disabled
            ? "!border-dark-200 !bg-background-200"
            : "border-background-200"
        } flex justify-center items-center w-6 h-6 rounded-lg bg-opacity-35 border-2 overflow-hidden transition-all duration-150`}
      >
        <View
          className={`${
            checked ? "w-6 h-6" : "w-0 h-0"
          } relative flex justify-center items-center bg-primary-300 rounded-full overflow-hidden transition-all duration-150`}
        >
          <Icon
            icon={faCheck}
            className={
              disabled
                ? "!text-dark-300"
                : darkText
                ? "!text-background-200"
                : "!text-white"
            }
          />
        </View>
      </View>

      <View className="flex">
        {label && (
          <Text
            size={size ?? "sm"}
            weight="medium"
            className={disabled ? "text-dark-300" : "text-white"}
          >
            {label}
          </Text>
        )}

        {text && (
          <Text size="xs" className={disabled ? "text-dark-300" : "text-white"}>
            {text}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
