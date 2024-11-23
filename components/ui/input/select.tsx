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

  value?: any;
  onChange: React.Dispatch<React.SetStateAction<any>>;
}

export default function Select({
  options,
  optionProperty,
  label,
  placeholder,
  disabled,
  value,
  onChange,
}: InputProps) {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [filteredOptions, setFilteredOptions] = React.useState(options);

  React.useEffect(() => setSearch(value ?? ""), [value]);

  React.useEffect(() => {
    const filteredOptions = options.filter((option) => {
      if (!optionProperty) {
        return option.toLowerCase().includes(search.toLowerCase());
      }
      return option[optionProperty]
        .toLowerCase()
        .includes(search.toLowerCase());
    });

    if (filteredOptions.includes(search)) setFilteredOptions(options);
    else setFilteredOptions(filteredOptions);
  }, [search]);

  function onFocus() {
    setFocused(true);
    setOpen(true);
  }

  function onBlur() {
    setFocused(false);
    setOpen(false);
  }

  function selectOption(option: any) {
    onBlur();
    setHovered(false);
    onChange(optionProperty ? option[optionProperty] : option);
    setFilteredOptions(options);
  }

  return (
    <View
      className="flex-1 flex gap-2 max-h-fit z-[-1]"
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
          open
            ? "overflow-visible"
            : "max-h-[40px] min-h-[40px] overflow-hidden"
        } relative flex-1`}
      >
        <View
          className={`${
            focused || open
              ? "border-primary-300"
              : hovered
              ? "border-primary-200"
              : "border-background-200"
          } ${disabled ? "!border-background-100" : ""} ${
            open ? "!rounded-b-none" : ""
          } flex-1 flex flex-row items-center gap-2 px-3 py-2 rounded-lg min-h-10 border-2 transition-all`}
        >
          <TextInput
            value={search}
            readOnly={disabled}
            placeholder={placeholder}
            tabIndex={disabled ? -1 : 0}
            placeholderTextColor="#8b8b8b"
            className={`flex-1 color-white text-base outline-none`}
            onFocus={() => onFocus()}
            onBlur={() => setTimeout(() => onBlur(), 200)}
            onChangeText={(text) => setSearch(text)}
          />

          <Pressable
            tabIndex={disabled ? -1 : 0}
            onPress={() => setOpen(!open)}
            onBlur={() => setTimeout(() => onBlur(), 200)}
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
              ? "max-h-[500px] border-2 top-[38px]"
              : "max-h-0 border-0 top-[40px]"
          } ${
            focused || open
              ? "border-primary-300"
              : hovered
              ? "border-primary-200"
              : "border-background-200"
          } ${
            disabled ? "!border-background-100" : ""
          } z-10 absolute left-0 flex w-full h-fit px-2 py-1 border-2 bg-background-100 rounded-b-lg overflow-y-auto transition-all`}
        >
          {filteredOptions.map((option, index) => (
            <Pressable
              key={option + index}
              tabIndex={disabled || !open ? -1 : 0}
              onPress={() => selectOption(option)}
            >
              <Text
                size="md"
                className="px-3 py-2 rounded-lg hover:bg-background-300 transition-all"
              >
                {optionProperty ? option[optionProperty] : option}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
