import Text from "@/components/ui/text/text";
import ScryfallService from "@/hooks/scryfall.service";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { Pressable, TextInput, View } from "react-native";
import Box from "../box/box";

export interface SearchBarProps {
  search: string;
  searchChange: React.Dispatch<React.SetStateAction<string>>;
  searchAction?: (search?: string) => void;
  placeholder?: string;
  noSearchResults?: boolean;
}

export default function SearchBar({
  search,
  searchChange,
  searchAction,
  placeholder,
  noSearchResults,
}: SearchBarProps) {
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [searchHovered, setSearchHovered] = React.useState(false);

  const [autoComplete, setAutoComplete] = React.useState([] as string[]);

  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  const baseClasses =
    "relative flex flex-row gap-3 items-center border-2 border-background-200 !px-6 !py-4 w-full rounded-full color-background-500 transition-colors ease-in-out duration-200";
  const hoverClasses = "border-primary-500";
  const focusClasses = "border-primary-300";
  const noSearchResultClasses = "border-red-500";

  useEffect(() => {
    ScryfallService.autocomplete(search).then((names) => {
      if (!names.includes(search)) setAutoComplete(names);
      else setAutoComplete([]);
    });
  }, [search]);

  return (
    <View
      className="mx-px w-full"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <Box
        className={`${focused ? focusClasses : ""} ${baseClasses} ${
          noSearchResults ? noSearchResultClasses : hovered ? hoverClasses : ""
        }`}
      >
        <FontAwesomeIcon className="color-white" icon={faSearch} />

        <View className="relative flex-1">
          <TextInput
            placeholder={placeholder ?? "Find a Card"}
            placeholderTextColor="#8b8b8b"
            className="flex-1 h-10 -my-4 color-white outline-none text-base"
            value={search}
            onBlur={onBlur}
            onFocus={onFocus}
            onChangeText={searchChange}
            onKeyPress={(event) =>
              (event as any)?.code === "Enter" ? searchAction?.() : null
            }
          />

          <Box
            className={`absolute top-[28px] left-0 flex w-full !px-2 rounded-t-none border-t-background-300 overflow-hidden transition-all ease-in-out duration-300 ${
              hovered
                ? "border-primary-500"
                : focused
                ? focusClasses
                : "border-background-200"
            } ${
              focused && autoComplete.length > 0
                ? "max-h-40 z-10 !py-2 !border-2"
                : "max-h-0 -z-10 !py-0 !border-none"
            }`}
          >
            <View className="flex max-h-36 overflow-y-auto">
              {autoComplete.map((name, index) => (
                <Pressable
                  key={name + index}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  className="px-4 py-1 rounded-full hover:bg-background-100 focus:bg-background-100 outline-none"
                  onPress={() => {
                    searchChange(name);
                    searchAction?.(name);
                  }}
                >
                  <Text className="max-w-full truncate">{name}</Text>
                </Pressable>
              ))}
            </View>
          </Box>
        </View>

        <Pressable
          onPress={() => searchAction?.()}
          onBlur={() => setSearchHovered(false)}
          onFocus={() => setSearchHovered(true)}
          onPointerEnter={() => setSearchHovered(true)}
          onPointerLeave={() => setSearchHovered(false)}
          className={`${
            searchHovered ? "bg-background-100" : ""
          } rounded-full px-4 py-2 -mx-3 -my-2 outline-none transition-all`}
        >
          <Text
            size="md"
            thickness="medium"
            className={
              "!text-background-500 " +
              (searchHovered ? "!text-primary-500" : "")
            }
          >
            Search
          </Text>
        </Pressable>
      </Box>
    </View>
  );
}
