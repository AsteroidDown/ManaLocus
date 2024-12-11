import React, { useEffect } from "react";
import { TextInput, View } from "react-native";
import Text from "../text/text";

export interface InputProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  secured?: boolean;
  multiline?: boolean;
  value?: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}

export default function Input({
  label,
  placeholder,
  disabled,
  secured,
  multiline,
  value,
  onChange,
}: InputProps) {
  const [text, setText] = React.useState(value ?? "");
  const [debouncedText, setDebouncedText] = React.useState(text);

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

  useEffect(() => onChange(debouncedText), [debouncedText]);

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

      <View className="flex-1 flex flex-row gap-2 min-w-fit">
        <TextInput
          value={text}
          multiline={multiline}
          placeholder={placeholder}
          tabIndex={disabled ? -1 : 0}
          secureTextEntry={secured}
          placeholderTextColor="#8b8b8b"
          className={`${
            focused
              ? "border-primary-300"
              : hovered
              ? "border-primary-200"
              : "border-background-200"
          } ${disabled ? "!border-background-100" : ""} ${
            multiline ? "min-h-24" : "h-10"
          } flex-1 px-3 py-2 color-white rounded-lg text-base border-2 border-background-200 focus:border-primary-300 outline-none transition-all`}
          onChangeText={setText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </View>
  );
}
