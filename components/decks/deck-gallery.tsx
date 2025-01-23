import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import Select from "@/components/ui/input/select";
import Pagination from "@/components/ui/pagination/pagination";
import { TableColumn } from "@/components/ui/table/table";
import { BoardType, BoardTypes } from "@/constants/boards";
import { FormatsWithCommander, MTGFormats } from "@/constants/mtg/mtg-format";
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
import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import DeckCard from "./deck-card";
import DecksTable from "./decks-table";

export interface DeckGalleryProps {
  userId?: string;
  kits?: boolean;
  favorites?: boolean;
  includeIds?: string[];
  endColumns?: TableColumn<Deck>[];
}

export default function DeckGallery({
  userId,
  includeIds,
  kits = false,
  favorites = false,
  endColumns,
}: DeckGalleryProps) {
  const { user } = useContext(UserContext);
  const { userPageUser } = useContext(UserPageContext);
  const { preferences, setPreferences } = useContext(UserPreferencesContext);

  const [decks, setDecks] = React.useState([] as Deck[]);
  const [meta, setMeta] = React.useState(null as PaginationMeta | null);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  const [listView, setListView] = React.useState(false);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [overflow, setOverflow] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [format, setFormat] = React.useState(null as MTGFormats | null);
  const [commanderFormat, setCommanderFormat] = React.useState(false);
  const [sort, setSort] = React.useState(
    preferences?.decksSortType ?? (DeckSortTypes.CREATED as DeckSortType)
  );
  const [cardSearch, setCardSearch] = React.useState("");
  const [cardAutoComplete, setCardAutoComplete] = React.useState(
    [] as string[]
  );
  const [cards, setCards] = React.useState([] as string[]);
  const [board, setBoard] = React.useState(BoardTypes.MAIN as BoardType);
  const [exclusiveCardSearch, setSearchType] = React.useState(false);

  const [commanderCardSearch, setCommanderCardSearch] = React.useState("");
  const [commanderCardAutoComplete, setCommanderCardAutoComplete] =
    React.useState([] as string[]);
  const [commanderSearch, setCommanderSearch] = React.useState("");

  const [partnerCardSearch, setPartnerCardSearch] = React.useState("");
  const [partnerCardAutoComplete, setPartnerCardAutoComplete] = React.useState(
    [] as string[]
  );
  const [partnerSearch, setPartnerSearch] = React.useState("");

  const [searchDto, setSearchDto] = React.useState({
    onlyKits: kits,
  } as DeckFiltersDTO);

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
    if (!cardSearch) {
      setCardSearch("");
      setCardAutoComplete([]);
      return;
    }

    ScryfallService.autocomplete(cardSearch).then((names) => {
      if (!names.includes(cardSearch)) setCardAutoComplete(names);
      else setCardAutoComplete([]);
    });
  }, [cardSearch]);

  useEffect(() => {
    if (!commanderCardSearch) {
      setCommanderCardSearch("");
      setCommanderCardAutoComplete([]);
      return;
    }

    ScryfallService.autocomplete(commanderCardSearch).then((names) => {
      if (!names.includes(commanderCardSearch))
        setCommanderCardAutoComplete(names);
      else setCommanderCardAutoComplete([]);
    });
  }, [commanderCardSearch]);

  useEffect(() => {
    if (!partnerCardSearch) {
      setPartnerCardSearch("");
      setPartnerCardAutoComplete([]);
      return;
    }

    ScryfallService.autocomplete(partnerCardSearch).then((names) => {
      if (!names.includes(partnerCardSearch)) setPartnerCardAutoComplete(names);
      else setPartnerCardAutoComplete([]);
    });
  }, [partnerCardSearch]);

  useEffect(() => {
    if (filtersOpen) return;

    searchWithFilters();
  }, [search]);

  useEffect(() => {
    setLoading(true);

    if (FormatsWithCommander.includes(format as any)) {
      setCommanderFormat(true);
    } else setCommanderFormat(false);

    if (userId) {
      if (favorites) {
        DeckService.getUserFavorites(userId, searchDto, {
          page,
          items: 50,
        }).then((response) => {
          setDecks(response.data);
          setMeta(response.meta);
          setLoading(false);
        });
      } else {
        DeckService.getByUser(userId, searchDto, { page, items: 50 }).then(
          (response) => {
            setDecks(response.data);
            setMeta(response.meta);
            setLoading(false);
          }
        );
      }
    } else {
      DeckService.getMany(searchDto, { page, items: 50 }).then((response) => {
        setDecks(response.data);
        setMeta(response.meta);
        setLoading(false);
      });
    }
  }, [user, searchDto]);

  function toggleListView() {
    setLocalStorageUserPreferences({
      decksViewType: listView ? DeckViewType.CARD : DeckViewType.LIST,
    });
    setPreferences(getLocalStorageUserPreferences() || {});
    setListView(!listView);
  }

  function searchWithFilters() {
    setSearchDto({
      ...(sort && { sort }),
      ...(board && { board }),
      ...(search && { search }),
      ...(kits && { onlyKits: true }),
      ...(includeIds && { includeIds }),
      ...(format && { deckFormat: format }),
      ...(cards?.length && { cardNames: cards }),
      ...(exclusiveCardSearch && { exclusiveCardSearch }),
      ...(partnerSearch !== undefined && { partner: partnerSearch }),
      ...(commanderSearch !== undefined && { commander: commanderSearch }),
      ...(user?.id === userPageUser?.id && { includePrivate: "true" }),
    });
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
        <View className="flex flex-row flex-wrap gap-4 z-[12]">
          <View className="flex-[2] z-[20] min-w-[250px]">
            <Select
              label="Format"
              value={format}
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
          </View>

          <View className="flex-1 z-[12] min-w-[250px]">
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

          {!kits && commanderFormat && (
            <View className="flex-1 z-[12] min-w-[250px]">
              <Select
                label="Commander"
                onChange={setCommanderSearch}
                onSearchChange={setCommanderCardSearch}
                options={commanderCardAutoComplete.map((card) => ({
                  label: card,
                  value: card,
                }))}
              />
            </View>
          )}

          {!kits && commanderFormat && (
            <View className="flex-1 z-[10] min-w-[250px]">
              <Select
                label="Partner"
                onChange={setPartnerSearch}
                onSearchChange={setPartnerCardSearch}
                options={partnerCardAutoComplete.map((card) => ({
                  label: card,
                  value: card,
                }))}
              />
            </View>
          )}
        </View>

        <View className="flex flex-row flex-wrap gap-4 z-[11]">
          <View className="flex-[3] z-[10] min-w-[250px]">
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

          {!kits && (
            <View className="flex-1 z-[10] min-w-[250px]">
              <Select
                label="Board"
                value={board}
                onChange={setBoard}
                options={Object.keys(BoardTypes).map((key) => {
                  return {
                    label: titleCase(key),
                    value: (BoardTypes as any)[key],
                  };
                })}
              />
            </View>
          )}

          {!kits && (
            <View className="flex-1 z-[8] min-w-[250px]">
              <Select
                label="Board Contains"
                value={exclusiveCardSearch}
                onChange={setSearchType}
                options={[
                  { label: "A Selected Card", value: false },
                  { label: "Every Selected Card", value: true },
                ]}
              />
            </View>
          )}
        </View>

        <View className="flex flex-row justify-end">
          <Button text="Search" action="primary" onClick={searchWithFilters} />
        </View>
      </View>

      {!listView && (
        <View className="flex flex-row flex-wrap lg:justify-start justify-center gap-4 z-[10]">
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
        <DecksTable
          decks={decks}
          loading={loading}
          rowClick={(deck) => router.push(`decks/${deck.id}`)}
          endColumns={endColumns}
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
