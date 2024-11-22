import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Pressable, TextInput, View } from "react-native";
import Text from "../text/text";

export interface InputProps {
  options: any[];
  optionProperty?: string;

  label?: string;
  placeholder?: string;
  disabled?: boolean;
  secured?: boolean;

  value?: any;
  onChange: React.Dispatch<React.SetStateAction<any>>;
}

export default function Select({
  options,
  optionProperty,
  label,
  placeholder,
  disabled,
  secured,
  value,
  onChange,
}: InputProps) {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [filteredOptions, setFilteredOptions] = React.useState(options);

  React.useEffect(() => {
    if (!search) {
      setFilteredOptions(options);
      if (value) setSearch(value);
    }

    setFilteredOptions(
      options.filter((option) => {
        if (!optionProperty) {
          return option.toLowerCase().includes(search.toLowerCase());
        }

        return option[optionProperty]
          .toLowerCase()
          .includes(search.toLowerCase());
      })
    );
  }, [search, options]);

  function onFocus() {
    setFocused(true);
    setOpen(true);
  }

  function onBlur() {
    setFocused(false);
    setOpen(false);
  }

  function selectOption(option: any) {
    value = optionProperty ? option[optionProperty] : option;
    onChange(option);
    setOpen(false);
    setSearch(value);
  }

  return (
    <View
      className="flex-1 flex gap-2 max-h-fit"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {label && (
        <Text size="md" thickness="bold">
          {label}
        </Text>
      )}

      <View className="relative flex-1">
        <View
          className={`${
            focused || open
              ? "border-primary-300"
              : hovered
              ? "border-primary-200"
              : "border-background-200"
          } ${disabled ? "!border-background-100" : ""} ${
            open ? "!rounded-b-none" : ""
          } flex-1 flex flex-row items-center gap-2 px-3 py-2 rounded-lg h-10 border-2 transition-all`}
        >
          <TextInput
            readOnly={disabled}
            value={search}
            placeholder={placeholder}
            tabIndex={disabled ? -1 : 0}
            secureTextEntry={secured}
            placeholderTextColor="#8b8b8b"
            className={`flex-1 color-white text-base outline-none`}
            onFocus={() => onFocus()}
            onBlur={() => onBlur()}
            onChangeText={(text) => setSearch(text)}
          />

          <Pressable
            tabIndex={disabled ? -1 : 0}
            onPress={() => setOpen(!open)}
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`${open ? "rotate-180" : ""} ${
                focused || open
                  ? "text-primary-300"
                  : hovered
                  ? "text-primary-200"
                  : "text-background-500"
              } transition-all`}
            />
          </Pressable>
        </View>

        <View
          className={`${
            open
              ? "max-h-[500px] border-2 top-10"
              : "max-h-0 border-0 top-[44px]"
          } ${
            focused || open
              ? "border-primary-300"
              : hovered
              ? "border-primary-200"
              : "border-background-200"
          } ${
            disabled ? "!border-background-100" : ""
          } absolute left-0 flex gap-2 w-full h-fit px-2 py-1 border-2 bg-background-100 rounded-b-lg overflow-y-auto transition-all`}
        >
          {filteredOptions.map((option, index) => (
            <Pressable
              tabIndex={disabled || !open ? -1 : 0}
              key={option + index}
              onPress={() => selectOption(option)}
            >
              <Text className="px-3 py-2 rounded-lg hover:bg-background-300 transition-all">
                {optionProperty ? option[optionProperty] : option}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
