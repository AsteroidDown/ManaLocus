import CardText from "@/components/cards/card-text";
import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import Select from "@/components/ui/input/select";
import Table, { TableColumn } from "@/components/ui/table/table";
import { MTGFormats } from "@/constants/mtg/mtg-format";
import { LostURL } from "@/constants/urls";
import UserPageContext from "@/contexts/user/user-page.context";
import UserPreferencesContext from "@/contexts/user/user-preferences.context";
import UserContext from "@/contexts/user/user.context";
import {
  getLocalStorageUserPreferences,
  setLocalStorageUserPreferences,
} from "@/functions/local-storage/user-preferences-local-storage";
import { titleCase } from "@/functions/text-manipulation";
import { PaginationMeta } from "@/hooks/pagination";
import DeckService from "@/hooks/services/deck.service";
import ScryfallService from "@/hooks/services/scryfall.service";
import { Deck } from "@/models/deck/deck";
import {
  DeckFiltersDTO,
  DeckSortType,
  DeckSortTypes,
  DeckViewType,
} from "@/models/deck/dtos/deck-filters.dto";
import {
  faBorderAll,
  faFilter,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { Link, router } from "expo-router";
import moment from "moment";
import React, { useContext, useEffect } from "react";
import { Image, View } from "react-native";
import Pagination from "../ui/pagination/pagination";
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
  const { preferences, setPreferences } = useContext(UserPreferencesContext);

  const [decks, setDecks] = React.useState([] as Deck[]);
  const [meta, setMeta] = React.useState(null as PaginationMeta | null);
  const [page, setPage] = React.useState(1);

  const [listView, setListView] = React.useState(false);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [overflow, setOverflow] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [format, setFormat] = React.useState(null as MTGFormats | null);
  const [sort, setSort] = React.useState(
    preferences?.decksSortType ?? (DeckSortTypes.CREATED as DeckSortType)
  );
  const [cardSearch, setCardSearch] = React.useState("");
  const [cardAutoComplete, setCardAutoComplete] = React.useState(
    [] as string[]
  );
  const [cards, setCards] = React.useState([] as string[]);

  useEffect(() => {
    if (preferences?.decksViewType) {
      setListView(preferences?.decksViewType === DeckViewType.LIST);
    }

    if (preferences?.decksSortType) {
      setSort(preferences.decksSortType);
    }
  }, [preferences]);

  useEffect(() => {
    if (filtersOpen) setTimeout(() => setOverflow(filtersOpen), 300);
    else setOverflow(false);
  }, [filtersOpen]);

  useEffect(() => {
    if (!cardSearch) return;

    ScryfallService.autocomplete(cardSearch).then((names) => {
      if (!names.includes(cardSearch)) setCardAutoComplete(names);
      else setCardAutoComplete([]);
    });
  }, [cardSearch]);

  useEffect(() => {
    const filters: DeckFiltersDTO = {
      ...(sort && { sort }),
      ...(search && { search }),
      ...(format && { deckFormat: format }),
      ...(cards?.length && { cardNames: cards }),
      ...(user?.id === userPageUser?.id && { includePrivate: "true" }),
    };

    if (userId) {
      if (favorites) {
        DeckService.getUserFavorites(userId, filters).then((response) => {
          setDecks(response.data);
          setMeta(response.meta);
        });
      } else
        DeckService.getByUser(userId, filters).then((response) => {
          setDecks(response.data);
          setMeta(response.meta);
        });
    } else {
      DeckService.getMany(filters, { page, items: 50 }).then((response) => {
        setDecks(response.data);
        setMeta(response.meta);
      });
    }
  }, [user, format, search, sort, page, cards]);

  function toggleListView() {
    setLocalStorageUserPreferences({
      decksViewType: listView ? DeckViewType.CARD : DeckViewType.LIST,
    });
    setPreferences(getLocalStorageUserPreferences() || {});
    setListView(!listView);
  }

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
          onClick={toggleListView}
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
        <View className="flex flex-row gap-4 z-[10]">
          <Select
            label="Format"
            value={format}
            className="!flex-[2]"
            onChange={setFormat}
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
            onChange={setSort}
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

        <View className="flex flex-row gap-4">
          <Select
            multiple
            label="Cards"
            onChange={setCards}
            onSearchChange={setCardSearch}
            options={cardAutoComplete.map((card) => ({
              label: card,
              value: card,
            }))}
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
          columns={
            [
              {
                fit: true,
                row: (deck) => (
                  <Image
                    source={{
                      uri: deck.featuredArtUrl?.length
                        ? deck.featuredArtUrl
                        : LostURL,
                    }}
                    className="h-7 w-10 rounded"
                  />
                ),
              },
              {
                title: "Name",
                row: (deck) => <Text>{deck.name}</Text>,
              },
              {
                fit: true,
                center: true,
                row: (deck) => (
                  <View className="max-w-fit py-0.5 px-1 bg-background-200 rounded-full overflow-hidden">
                    <CardText text={deck.colors} />
                  </View>
                ),
              },
              {
                title: "Format",
                row: (deck) => <Text>{titleCase(deck.format)}</Text>,
              },
              {
                title: "Creator",
                row: (deck) => <Text>{deck.user?.name}</Text>,
              },
              {
                title: "Created",
                row: (deck) => (
                  <Text>{moment(deck.created).format("MMM D, YYYY")}</Text>
                ),
              },
              {
                title: "Modified",
                row: (deck) => (
                  <Text>{moment(deck.updated).format("MMM D, YYYY")}</Text>
                ),
              },
              {
                fit: true,
                center: true,
                title: "Favorites",
                row: (deck) => <Text>{deck.favorites}</Text>,
              },
              {
                fit: true,
                center: true,
                title: "Views",
                row: (deck) => <Text>{deck.views}</Text>,
              },
            ] as TableColumn<Deck>[]
          }
        />
      )}

      {meta && (
        <Pagination
          meta={meta}
          center={!listView}
          onChange={(page) => setPage(page)}
        />
      )}
    </View>
  );
}
