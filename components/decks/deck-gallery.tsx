import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import Select from "@/components/ui/input/select";
import { MTGFormats } from "@/constants/mtg/mtg-format";
import UserPageContext from "@/contexts/user/user-page.context";
import UserContext from "@/contexts/user/user.context";
import { titleCase } from "@/functions/text-manipulation";
import DeckService from "@/hooks/services/deck.service";
import { Deck } from "@/models/deck/deck";
import {
  DeckFiltersDTO,
  DeckSortType,
  DeckSortTypes,
} from "@/models/deck/dtos/deck-filters.dto";
import {
  faBorderAll,
  faFilter,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { Link, router } from "expo-router";
import moment from "moment";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import CardText from "../cards/card-text";
import Table from "../ui/table/table";
import Text from "../ui/text/text";
import DeckCard from "./deck-card";

export interface DeckGalleryProps {
  userId?: string;
  favorites?: boolean;
}

export default function DeckGallery({
  userId,
  favorites = false,
}: DeckGalleryProps) {
  const { user } = useContext(UserContext);
  const { userPageUser } = useContext(UserPageContext);

  const [decks, setDecks] = React.useState([] as Deck[]);

  const [listView, setListView] = React.useState(false);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [overflow, setOverflow] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [format, setFormat] = React.useState(null as MTGFormats | null);
  const [sort, setSort] = React.useState(DeckSortTypes.CREATED as DeckSortType);

  useEffect(() => {
    const filters: DeckFiltersDTO = {
      ...(sort && { sort }),
      ...(search && { search }),
      ...(format && { deckFormat: format }),
      ...(user?.id === userPageUser?.id && { includePrivate: "true" }),
    };

    if (userId) {
      if (favorites) {
        DeckService.getUserFavorites(userId, filters).then((decks) =>
          setDecks(decks)
        );
      } else
        DeckService.getByUser(userId, filters).then((decks) => setDecks(decks));
    } else {
      DeckService.getMany(filters).then((decks) => setDecks(decks));
    }
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
          type="outlined"
          className="max-w-12 self-end"
          icon={listView ? faBorderAll : faList}
          onClick={() => setListView(!listView)}
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
                label: "Favorites (Ascending)",
                value: DeckSortTypes.FAVORITES_REVERSE,
              },
              { label: "Views", value: DeckSortTypes.VIEWS },
              {
                label: "Views (Ascending)",
                value: DeckSortTypes.VIEWS_REVERSE,
              },
            ]}
          />
        </View>
      </View>

      {!listView && (
        <View className="flex flex-row flex-wrap gap-4 z-[10]">
          {decks?.map((deck, index) => (
            <Link
              key={deck.id + deck.name + index}
              href={`${userId ? "../" : ""}decks/${deck.id}`}
            >
              <DeckCard deck={deck} />
            </Link>
          ))}
        </View>
      )}

      {listView && (
        <Table
          data={decks}
          rowClick={(deck) => router.push(`decks/${deck.id}`)}
          columns={[
            {
              title: "Name",
              row: decks?.map((deck) => <Text>{deck.name}</Text>),
            },
            {
              fit: true,
              center: true,
              row: decks?.map((deck) => (
                <View className="max-w-fit py-0.5 px-1 bg-background-200 rounded-full overflow-hidden">
                  <CardText text={deck.colors} />
                </View>
              )),
            },
            {
              title: "Format",
              row: decks?.map((deck) => <Text>{titleCase(deck.format)}</Text>),
            },
            {
              title: "Creator",
              row: decks?.map((deck) => <Text>{deck.user?.name}</Text>),
            },
            {
              title: "Created",
              row: decks?.map((deck) => (
                <Text>{moment(deck.created).format("MMM D, YYYY")}</Text>
              )),
            },
            {
              title: "Modified",
              row: decks?.map((deck) => (
                <Text>{moment(deck.updated).format("MMM D, YYYY")}</Text>
              )),
            },
            {
              fit: true,
              center: true,
              title: "Favorites",
              row: decks?.map((deck) => <Text>{deck.favorites}</Text>),
            },
            {
              fit: true,
              center: true,
              title: "Views",
              row: decks?.map((deck) => <Text>{deck.views}</Text>),
            },
          ]}
        />
      )}
    </View>
  );
}
