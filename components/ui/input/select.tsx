import { faChevronDown, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
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
  notFoundText?: string;
  multiple?: boolean;
  disabled?: boolean;
  property?: string;

  squareLeft?: boolean;
  squareRight?: boolean;
  maxHeight?: string;

  clearOnFocus?: boolean;

  value?: any;
  onChange: Dispatch<SetStateAction<any>>;
  onSearchChange?: Dispatch<SetStateAction<string>>;
};

export default function Select({
  options,

  label,
  placeholder,
  notFoundText,
  multiple,
  disabled,
  property,

  squareLeft,
  squareRight,
  maxHeight,

  clearOnFocus,

  value,
  onChange,

  className,
  onSearchChange,
}: InputProps) {
  const inputRef = useRef<View>(null);

  const [offsetHeight, setOffsetHeight] = useState(0);

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([] as any[]);
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => setFilteredOptions(options), [options]);

  useEffect(() => {
    if (!multiple && !value) setSearch("");
    else if (multiple && !value?.length) {
      setSearch("");
      setSelectedOptions([]);
    }
  }, [value]);

  useEffect(() => {
    if (!options?.length) return;

    const foundOption =
      options.find((option) =>
        property
          ? option.value?.[property] === value?.[property]
          : option.value === value
      )?.label ?? "";

    if (foundOption && !multiple) setSearch(foundOption);
  }, [value, options]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearchChange?.(search);

      if (
        !search ||
        filteredOptions.length === 1 ||
        filteredOptions
          .map((option) => option.label.toLowerCase())
          .includes(search.toLowerCase())
      ) {
        setFilteredOptions(options);

        return;
      }

      const optionsFiltered = options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      );

      setFilteredOptions(optionsFiltered);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  function onFocus() {
    setFocused(true);
    setOpen(true);

    if (clearOnFocus && !value) setSearch("");
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
      setOpen(false);
      setHovered(false);
      onChange(option.value);
      setSearch(option.label);
      setFilteredOptions([...options]);
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
      className={`${className} flex-1 flex gap-2 max-h-fit min-w-[144px] z-[-1]`}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {label && (
        <Text noWrap weight="medium">
          {label}
        </Text>
      )}

      <View
        style={{ maxHeight: multiple ? offsetHeight : 32, minHeight: 32 }}
        className={`${
          open ? "overflow-visible" : "overflow-hidden"
        } min-w-0 relative flex-1`}
      >
        <View
          ref={inputRef}
          onLayout={() => {
            inputRef.current?.measureInWindow((_x, _y, _width, height) =>
              setOffsetHeight(height)
            );
          }}
          className={`${
            focused || open
              ? "border-primary-300"
              : hovered
              ? "border-primary-200"
              : "border-background-200"
          } ${disabled ? "!border-dark-200 !bg-dark-100" : ""} ${
            open ? "!rounded-b-none" : ""
          } ${squareLeft ? "!rounded-l-none" : ""} ${
            squareRight ? "!rounded-r-none" : ""
          } ${
            multiple ? "min-h-fit" : "min-h-8 max-h-8"
          } flex-1 flex flex-row flex-wrap items-center gap-2 min-w-0 px-3 py-2 rounded-lg border-2 overflow-hidden transition-all`}
        >
          {multiple && selectedOptions.length > 0 && (
            <View className="flex flex-row flex-wrap gap-1 items-center max-w-full -mt-[5px] -mb-[5px]">
              {selectedOptions.map((option, index) => (
                <View
                  key={index}
                  className="flex flex-row items-center gap-1 pl-3 pr-2 py-px bg-background-300 bg-opacity-50 rounded-xl"
                >
                  <Text key={index} size="sm" className="!text-gray-200">
                    {option.label}
                  </Text>

                  <Button
                    rounded
                    size="xs"
                    icon={faX}
                    type="clear"
                    action="default"
                    buttonClasses="!px-1 max-w-[20px] max-h-[20px]"
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
            className={`flex-1 color-white -mt-1 text-sm min-w-0 outline-none ${
              multiple ? "max-h-4 -mb-1" : ""
            }`}
            onFocus={() => (disabled ? null : onFocus())}
            onBlur={() => setTimeout(() => onBlur(), 200)}
            onChangeText={(change) => setSearch(change)}
          />

          <Pressable
            tabIndex={disabled ? -1 : 0}
            className={`${multiple ? "max-h-4 -mb-1" : "-mt-1"}`}
            onPress={() => (disabled ? null : setOpen(!open))}
            onBlur={() => setTimeout(() => onBlur(), 200)}
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`${open ? "rotate-180" : ""} ${
                disabled
                  ? "text-dark-300"
                  : focused || open
                  ? "text-primary-300"
                  : hovered
                  ? "text-primary-200"
                  : "text-background-500"
              } -mt-0.5 transition-all`}
            />
          </Pressable>
        </View>

        <View
          style={{ elevation: 100, zIndex: 100 }}
          className={`${
            open
              ? `${maxHeight ?? "max-h-[500px]"} border-2 -mt-0.5`
              : `${multiple ? "!border-0" : ""} max-h-0 border-0`
          } ${
            focused || open
              ? "border-primary-300"
              : hovered
              ? "border-primary-200"
              : "border-background-200"
          } ${
            disabled ? "!border-background-100" : ""
          } z-10 left-0 flex w-full h-fit border-2 bg-background-100 rounded-b-lg overflow-y-auto transition-all`}
        >
          {filteredOptions?.length ? (
            filteredOptions.map((option, index) => (
              <Pressable
                key={index + option.label}
                tabIndex={disabled || !open ? -1 : 0}
                onPress={() => selectOption(option)}
              >
                <Text className="px-3 py-1 hover:bg-background-300 transition-all">
                  {typeof option === "object" && option?.label
                    ? option.label
                    : typeof option === "string"
                    ? option
                    : null}
                </Text>
              </Pressable>
            ))
          ) : (
            <Text className="px-3 py-2 rounded-lg !text-dark-600 !italic">
              {notFoundText ?? "No Options Found"}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
