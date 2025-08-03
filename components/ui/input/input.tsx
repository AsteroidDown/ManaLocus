import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TextInput, View, ViewProps } from "react-native";
import Button from "../button/button";
import Text from "../text/text";

export interface InputProps extends ViewProps {
  label?: string;
  placeholder?: string;

  error?: boolean;
  errorMessage?: string;

  disabled?: boolean;
  secured?: boolean;
  multiline?: boolean;

  squareLeft?: boolean;
  squareRight?: boolean;

  value?: string;
  onChange: Dispatch<SetStateAction<string>>;
  enterAction?: () => void;
}

export default function Input({
  label,
  placeholder,

  error,
  errorMessage,

  disabled,
  secured,
  multiline,

  squareLeft,
  squareRight,

  value,
  onChange,
  enterAction,

  className,
}: InputProps) {
  const [text, setText] = useState(value ?? "");

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (value !== text) setText(String(value ?? ""));
  }, [value]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => onChange(text), 300);
    return () => clearTimeout(delayDebounceFn);
  }, [text]);

  return (
    <View
      className={`flex-1 flex gap-2 max-h-fit z-[-1] min-w-fit ${className}`}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {label && <Text weight="medium">{label}</Text>}

      <View
        className={`${
          error
            ? "border-danger-100"
            : focused
            ? "border-primary-300"
            : hovered
            ? "border-primary-200"
            : "border-background-200"
        } ${disabled ? "!border-background-100" : ""} ${
          multiline ? "min-h-24 !max-h-[80px]" : "h-8"
        } ${squareLeft ? "rounded-l-none" : ""} ${
          squareRight ? "rounded-r-none" : ""
        } flex-1 flex flex-row items-center px-3 py-2 max-h-8 min-h-8 color-white rounded-lg text-sm border-2 transition-all`}
      >
        <TextInput
          value={text}
          multiline={multiline}
          placeholder={placeholder}
          tabIndex={disabled ? -1 : 0}
          secureTextEntry={secured && !showText}
          className="flex-1 outline-none "
          placeholderTextColor="#8b8b8b"
          onChangeText={setText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyPress={(e) => {
            if (e.nativeEvent.key === "Enter") {
              enterAction?.();
            }
          }}
        />

        {secured && (
          <Button
            size="sm"
            type="clear"
            className="-mr-3"
            icon={showText ? faEyeSlash : faEye}
            onClick={() => setShowText(!showText)}
          />
        )}
      </View>

      <View
        className={`${
          error && errorMessage ? "max-h-fit" : "max-h-0 -mt-2"
        } overflow-hidden transition-all duration-300`}
      >
        <Text size="md" action="danger">
          {errorMessage}
        </Text>
      </View>
    </View>
  );
}
