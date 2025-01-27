import React, { useEffect } from "react";
import { TextInput, View } from "react-native";
import Text from "../text/text";

export interface InputProps {
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
  onChange: React.Dispatch<React.SetStateAction<string>>;
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
}: InputProps) {
  const [text, setText] = React.useState(value ?? "");
  const [debouncedText, setDebouncedText] = React.useState(text);
  const [prevDebouncedText, setPrevDebouncedText] = React.useState(text);

  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  const [initial, setInitial] = React.useState(true);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!text && value && initial) {
        setText(value);
        setInitial(false);
      }

      setDebouncedText(text);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [value, text]);

  useEffect(() => {
    if (text !== prevDebouncedText) onChange(debouncedText);
    setPrevDebouncedText(debouncedText);
  }, [debouncedText]);

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

      <TextInput
        value={text}
        multiline={multiline}
        placeholder={placeholder}
        tabIndex={disabled ? -1 : 0}
        secureTextEntry={secured}
        placeholderTextColor="#8b8b8b"
        className={`${
          error
            ? "border-danger-100"
            : focused
            ? "border-primary-300"
            : hovered
            ? "border-primary-200"
            : "border-background-200"
        } ${disabled ? "!border-background-100" : ""} ${
          multiline ? "min-h-24" : "h-10"
        } ${squareLeft ? "rounded-l-none" : ""} ${
          squareRight ? "rounded-r-none" : ""
        } flex-1 px-3 py-2 max-h-[40px] min-h-[40px] color-white rounded-lg text-base border-2  outline-none transition-all`}
        onChangeText={setText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyPress={(e) => {
          if (e.nativeEvent.key === "Enter") {
            enterAction?.();
          }
        }}
      />

      <View
        className={`${
          error && errorMessage ? "max-h-10" : "max-h-0 -mt-2"
        } overflow-hidden transition-all duration-300`}
      >
        <Text size="sm" action="danger">
          {errorMessage}
        </Text>
      </View>
    </View>
  );
}
