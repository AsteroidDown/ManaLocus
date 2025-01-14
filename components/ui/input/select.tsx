import { faChevronDown, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { Pressable, TextInput, View, ViewProps } from "react-native";
import Button from "../button/button";
import Text from "../text/text";

export interface SelectOption {
  label: string;
  value: any;
}

export type InputProps = ViewProps & {
  options: SelectOption[];

  label?: string;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  property?: string;

  squareLeft?: boolean;
  squareRight?: boolean;
  maxHeight?: string;

  value?: any;
  onChange: React.Dispatch<React.SetStateAction<any>>;
  onSearchChange?: React.Dispatch<React.SetStateAction<string>>;
};

export default function Select({
  options,

  label,
  placeholder,
  multiple,
  disabled,
  property,

  squareLeft,
  squareRight,
  maxHeight,

  value,
  onChange,

  className,
  onSearchChange,
}: InputProps) {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [selectedOptions, setSelectedOptions] = React.useState([] as any[]);
  const [filteredOptions, setFilteredOptions] = React.useState(options);

  useEffect(() => setFilteredOptions(options), [options]);

  useEffect(() => {
    if (!options?.length) return;

    const search =
      options.find((option) =>
        property
          ? option.value?.[property] === value?.[property]
          : option.value === value
      )?.label ?? "";

    if (!multiple && search) setSearch(search);
  }, [value, options]);

  useEffect(() => {
    const foundOption = options.find(
      (option) => option.label.toLowerCase() === search.toLowerCase()
    );

    if (!multiple && foundOption) selectOption(foundOption);
    else {
      const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      );

      setFilteredOptions(filteredOptions);
    }
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
    if (multiple) {
      const optionsOut = [...selectedOptions, option];
      onChange(optionsOut.map((option) => option.value));
      setSelectedOptions(optionsOut);
      setSearch("");
      onSearchChange?.("");
    } else {
      onBlur();
      setHovered(false);
      setOpen(false);
      onChange(option.value);
      setSearch(option.label);
      setFilteredOptions(options);
    }
  }

  function removeOption(index: number) {
    const optionsOut = [...selectedOptions];
    optionsOut.splice(index, 1);

    onChange(optionsOut.map((option) => option.value));
    setSelectedOptions(optionsOut);
  }

  return (
    <View
      style={{ elevation: 10, zIndex: 10 }}
      className={`${className} flex-1 flex gap-2 max-h-fit min-w-fit z-[-1]`}
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
          open ? "overflow-visible" : "overflow-hidden"
        } max-h-[40px] min-h-[40px] min-w-fit relative flex-1`}
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
          } ${squareLeft ? "!rounded-l-none" : ""} ${
            squareRight ? "!rounded-r-none" : ""
          } flex-1 flex flex-row items-center gap-2 min-w-fit min-h-10 px-3 py-2 rounded-lg border-2 overflow-hidden transition-all`}
        >
          {multiple && selectedOptions.length > 0 && (
            <View className="flex flex-row gap-2 items-center">
              {selectedOptions.map((option, index) => (
                <View
                  key={index}
                  className="flex flex-row items-center gap-0.5 pl-3 pr-2 py-0.5 bg-background-300 rounded-xl"
                >
                  <Text key={index} size="sm">
                    {option.label}
                  </Text>

                  <Button
                    rounded
                    size="xs"
                    icon={faX}
                    type="clear"
                    action="default"
                    buttonClasses="!px-1 max-w-[24px] max-h-[24px]"
                    onClick={() => removeOption(index)}
                  />
                </View>
              ))}
            </View>
          )}

          <TextInput
            value={search}
            readOnly={disabled}
            placeholder={placeholder}
            tabIndex={disabled ? -1 : 0}
            placeholderTextColor="#8b8b8b"
            className={`flex-1 color-white text-base outline-none`}
            onFocus={() => onFocus()}
            onBlur={() => setTimeout(() => onBlur(), 200)}
            onChangeText={(change) => {
              setSearch(change);
              onSearchChange?.(change);
            }}
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
          style={{ elevation: 100, zIndex: 100 }}
          className={`${
            open
              ? (maxHeight ?? "max-h-[500px]") + " border-2 top-[38px]"
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
              key={index + option.label}
              tabIndex={disabled || !open ? -1 : 0}
              onPress={() => selectOption(option)}
            >
              <Text
                size="md"
                className="px-3 py-2 rounded-lg hover:bg-background-300 transition-all"
              >
                {typeof option === "object" && option?.label
                  ? option.label
                  : typeof option === "string"
                  ? option
                  : null}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
