import { currency as currencyMask } from "@/functions/text-manipulation";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import Button from "../button/button";
import Text from "../text/text";

export interface NumberInputProps {
  label?: string;
  placeholder?: string;

  currency?: boolean;
  disabled?: boolean;
  secured?: boolean;

  inputClasses?: string;

  value?: number;
  onChange: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export default function NumberInput({
  label,
  placeholder,

  currency,
  disabled,
  secured,

  inputClasses,

  value,
  onChange,
}: NumberInputProps) {
  const [text, setText] = useState(value ? String(value) : "");

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (value !== Number(text)) setText(String(value ?? 0));
  }, [value]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => onChange(Number(text)), 300);
    return () => clearTimeout(delayDebounceFn);
  }, [text]);

  return (
    <View
      className="flex-1 flex gap-2 max-h-fit z-[-1] min-w-fit"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {label && (
        <Text size="md" thickness="bold">
          {label}
        </Text>
      )}

      <View
        className={`${
          focused
            ? "border-primary-300"
            : hovered
            ? "border-primary-200"
            : "border-background-200"
        } ${
          disabled ? "!border-background-100" : ""
        } flex-1 flex flex-row justify-between items-center gap-2 min-h-fit min-w-fit border-2 rounded-lg border-background-200 overflow-hidden`}
      >
        <TextInput
          value={currency ? currencyMask(Number(text) / 100) : text}
          placeholder={placeholder}
          tabIndex={disabled ? -1 : 0}
          secureTextEntry={secured}
          placeholderTextColor="#8b8b8b"
          className={`flex-1 px-3 py-2 -my-0.5 color-white text-base outline-none transition-all ${inputClasses}`}
          onChangeText={(change) => setText(change.replace(/[^0-9]/g, ""))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        <View className="flex justify-center max-h-9">
          <View className="flex justify-center items-center max-h-5 overflow-hidden">
            <Button
              square
              size="xs"
              type="clear"
              className="mt-1"
              icon={faChevronUp}
              disabled={!(hovered || focused)}
              onClick={() => setText(String(Number(text) + 1))}
            />
          </View>

          <View className="flex justify-center items-center max-h-5 overflow-hidden">
            <Button
              square
              size="xs"
              type="clear"
              className="mb-1"
              icon={faChevronDown}
              disabled={!(hovered || focused)}
              onClick={() => setText(String(Number(text) - 1))}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
