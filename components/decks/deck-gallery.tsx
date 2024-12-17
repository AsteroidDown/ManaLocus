import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import Select from "@/components/ui/input/select";
import { MTGFormats } from "@/constants/mtg/mtg-format";
import UserContext from "@/contexts/user/user.context";
import { titleCase } from "@/functions/text-manipulation";
import DeckService from "@/hooks/services/deck.service";
import { Deck } from "@/models/deck/deck";
import {
  DeckSortType,
  DeckSortTypes,
} from "@/models/deck/dtos/deck-filters.dto";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { Link } from "expo-router";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import DeckCard from "./deck-card";

export default function DeckGallery() {
  const { user } = useContext(UserContext);

  const [decks, setDecks] = React.useState([] as Deck[]);

  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [overflow, setOverflow] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [format, setFormat] = React.useState(null as MTGFormats | null);
  const [sort, setSort] = React.useState(DeckSortTypes.CREATED as DeckSortType);

  useEffect(() => {
    DeckService.getMany({
      ...(search && { search }),
      ...(format && { deckFormat: format }),
      ...(sort && { sort }),
    }).then((decks) => setDecks(decks));
  }, [user, format, search, sort]);

  useEffect(() => {
    if (filtersOpen) setTimeout(() => setOverflow(filtersOpen), 300);
    else setOverflow(false);
  }, [filtersOpen]);

  return (
    <View className="flex gap-4">
      <View className="flex flex-row gap-4">
        <Input
          label="Search"
          placeholder="Search for a deck or card"
          value={search}
          onChange={setSearch}
        />

        <Button
          icon={faFilter}
          className="self-end"
          type={filtersOpen ? "default" : "outlined"}
          onClick={() => setFiltersOpen(!filtersOpen)}
        />
      </View>

      <View
        className={`${filtersOpen ? "max-h-[1000px]" : "max-h-0"} ${
          !overflow && "overflow-hidden"
        } flex gap-4 z-[11] transition-all duration-300`}
      >
        <View className="flex flex-row gap-4">
          <Select
            label="Format"
            value={format}
            className="!flex-[2]"
            onChange={(change) => setFormat(change)}
            options={[
              { label: "All", value: null },
              ...Object.keys(MTGFormats).map((key) => {
                return {
                  label: titleCase(key),
                  value: (MTGFormats as any)[key],
                };
              }),
            ]}
          />

          <Select
            label="Sort"
            value={sort}
            onChange={(change) => setSort(change)}
            options={[
              { label: "Created", value: DeckSortTypes.CREATED },
              {
                label: "Created (Old to New)",
                value: DeckSortTypes.CREATED_REVERSE,
              },
              { label: "Updated", value: DeckSortTypes.UPDATED },
              {
                label: "Updated (Old to New)",
                value: DeckSortTypes.UPDATED_REVERSE,
              },
              { label: "Favorites", value: DeckSortTypes.FAVORITES },
              {
                label: "Favorites (Descending)",
                value: DeckSortTypes.FAVORITES_REVERSE,
              },
            ]}
          />
        </View>
      </View>

      <View className="flex flex-row flex-wrap gap-4 z-[10]">
        {decks?.map((deck, index) => (
          <Link key={deck.id + deck.name + index} href={`decks/${deck.id}`}>
            <DeckCard deck={deck} />
          </Link>
        ))}
      </View>
    </View>
  );
}
