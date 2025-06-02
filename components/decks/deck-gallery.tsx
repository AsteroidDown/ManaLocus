import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import Select from "@/components/ui/input/select";
import Pagination from "@/components/ui/pagination/pagination";
import Placeholder from "@/components/ui/placeholder/placeholder";
import { TableColumn } from "@/components/ui/table/table";
import Text from "@/components/ui/text/text";
import { BoardType, BoardTypes } from "@/constants/boards";
import { BracketNumber, BracketType } from "@/constants/mtg/brackets";
import { FormatsWithCommander, MTGFormats } from "@/constants/mtg/mtg-format";
import { SortTypes } from "@/constants/sorting";
import { PatreonURL } from "@/constants/urls";
import LoadingContext from "@/contexts/ui/loading.context";
import UserPageContext from "@/contexts/user/user-page.context";
import UserPreferencesContext from "@/contexts/user/user-preferences.context";
import UserContext from "@/contexts/user/user.context";
import { setLocalStorageUserPreferences } from "@/functions/local-storage/user-preferences-local-storage";
import { titleCase } from "@/functions/text-manipulation";
import { PaginationMeta } from "@/hooks/pagination";
import DeckService from "@/hooks/services/deck.service";
import ScryfallService from "@/hooks/services/scryfall.service";
import { AdType } from "@/models/ads/ads";
import { Deck } from "@/models/deck/deck";
import {
  DeckFiltersDTO,
  DeckSortType,
  DeckSortTypes,
  DeckViewType,
} from "@/models/deck/dtos/deck-filters.dto";
import { faPatreon } from "@fortawesome/free-brands-svg-icons";
import {
  faBorderAll,
  faFilter,
  faList,
  faPlus,
  faSearch,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { Link, router } from "expo-router";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import AdCard from "../ads/ad-card";
import Skeleton from "../ui/skeleton/skeleton";
import Tooltip from "../ui/tooltip/tooltip";
import DeckCard from "./deck-card";
import DecksTable, { DeckTableAd } from "./decks-table";

const AD_THRESHOLD = 10;

export interface DeckGalleryProps {
  userId?: string;
  kits?: boolean;
  favorites?: boolean;
  includeIds?: string[];
  collections?: boolean;
  noLoadScreen?: boolean;
  endColumns?: TableColumn<Deck>[];
}

export default function DeckGallery({
  userId,
  includeIds,
  kits = false,
  favorites = false,
  collections = false,
  noLoadScreen = false,
  endColumns,
}: DeckGalleryProps) {
  const { user } = useContext(UserContext);
  const { setLoading } = useContext(LoadingContext);
  const { userPageUser } = useContext(UserPageContext);
  const { preferences } = useContext(UserPreferencesContext);

  const width = useWindowDimensions().width;

  const [decks, setDecks] = useState([] as Deck[]);
  const [meta, setMeta] = useState(null as PaginationMeta | null);
  const [page, setPage] = useState(1);
  const [decksLoading, setDecksLoading] = useState(false);

  const [listView, setListView] = useState(
    (preferences?.deckCardViewType as any) === DeckViewType.LIST
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [overflow, setOverflow] = useState(false);

  const [search, setSearch] = useState("");
  const [format, setFormat] = useState(null as MTGFormats | null);
  const [commanderFormat, setCommanderFormat] = useState(false);
  const [sort, setSort] = useState(
    preferences?.decksSortType ?? (DeckSortTypes.CREATED as DeckSortType)
  );
  const [cardSearch, setCardSearch] = useState("");
  const [cardAutoComplete, setCardAutoComplete] = useState([] as string[]);
  const [cards, setCards] = useState([] as string[]);
  const [board, setBoard] = useState(BoardTypes.MAIN as BoardType);
  const [exclusiveCardSearch, setSearchType] = useState(false);

  const [commanderCardSearch, setCommanderCardSearch] = useState("");
  const [commanderCardAutoComplete, setCommanderCardAutoComplete] = useState(
    [] as string[]
  );
  const [commanderSearch, setCommanderSearch] = useState("");

  const [partnerCardSearch, setPartnerCardSearch] = useState("");
  const [partnerCardAutoComplete, setPartnerCardAutoComplete] = useState(
    [] as string[]
  );
  const [partnerSearch, setPartnerSearch] = useState("");
  const [bracket, setBracket] = useState(null as number | null);

  const [searchDto, setSearchDto] = useState({
    includeIds,
    onlyKits: kits,
    onlyCollections: collections,
  } as DeckFiltersDTO);

  const [deckCards, setDeckCards] = useState([] as ReactNode[]);
  const [deckList, setDeckList] = useState([] as (Deck | DeckTableAd)[]);

  const [resultsText, setResultsText] = useState("");

  const loadingDecks = Array(24).fill(undefined);

  useEffect(() => {
    updateResultsText();

    if (!decks?.length) return;

    if (listView) {
      const decksToShow = decks.reduce((acc, deck, index) => {
        if (
          user?.access?.showAds &&
          index >= AD_THRESHOLD &&
          index % AD_THRESHOLD === 0
        ) {
          acc.push({
            url: PatreonURL,
            icon: faPatreon,
            type: AdType.PATREON,
            title: "Join our Patreon to remove ads and more!",
          } as DeckTableAd);
        }
        acc.push(deck);

        return acc;
      }, [] as (Deck | DeckTableAd)[]);

      setDeckList(decksToShow);
    } else {
      const cardsToShow = decks.reduce((acc, deck, index) => {
        if (
          user?.access?.showAds &&
          index >= AD_THRESHOLD &&
          index % AD_THRESHOLD === 0
        ) {
          acc.push(<AdCard type={AdType.PATREON} />);
        }

        const deckCard = (
          <Link href={getDeckURL(deck)} key={deck.id + deck.name + index}>
            <DeckCard deck={deck} />
          </Link>
        );
        acc.push(deckCard);

        return acc;
      }, [] as ReactNode[]);

      setDeckCards(cardsToShow);
    }
  }, [decks, listView]);

  useEffect(() => {
    if (noLoadScreen) return;

    if (!decks?.length && decksLoading) setLoading(true);
    else if (!decksLoading) setLoading(false);
  }, [decks, decksLoading]);

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
    setCommanderFormat(FormatsWithCommander.includes(format as any));
  }, [format]);

  useEffect(() => {
    if (!commanderCardSearch) {
      setCommanderCardSearch("");
      setCommanderCardAutoComplete([]);
      return;
    }

    ScryfallService.autocomplete(commanderCardSearch).then((names) =>
      setCommanderCardAutoComplete(names)
    );
  }, [commanderCardSearch]);

  useEffect(() => {
    if (!partnerCardSearch) {
      setPartnerCardSearch("");
      setPartnerCardAutoComplete([]);
      return;
    }

    ScryfallService.autocomplete(partnerCardSearch).then((names) =>
      setPartnerCardAutoComplete(names)
    );
  }, [partnerCardSearch]);

  useEffect(() => {
    if (preferences?.decksViewType) {
      setListView(preferences.decksViewType === DeckViewType.LIST);
    }
    if (preferences?.decksSortType) setSort(preferences.decksSortType);

    setSearchDto({
      ...searchDto,
      ...(preferences?.decksViewType && { view: preferences.decksViewType }),
      ...(preferences?.decksSortType
        ? { sort: preferences.decksSortType }
        : { sort: DeckSortTypes.CREATED }),
      ...(preferences?.deckCardViewType && {
        cardView: preferences.deckCardViewType,
      }),
      ...(preferences?.deckCardGrouping && {
        cardGrouping: preferences.deckCardGrouping,
      }),
      ...(preferences?.deckCardSortType && {
        cardSort: preferences.deckCardSortType,
      }),
      ...(preferences?.deckCardSortDirection && {
        cardSortDirection: preferences.deckCardSortDirection,
      }),
      ...(preferences?.deckCardColumnShowPrice && {
        cardShowPrice: preferences.deckCardColumnShowPrice,
      }),
      ...(preferences?.deckCardColumnShowManaValue && {
        cardShowManaValue: preferences.deckCardColumnShowManaValue,
      }),
      ...(preferences?.deckCardColumnGroupMulticolored && {
        cardGroupMulticolored: preferences.deckCardColumnGroupMulticolored,
      }),
    });
  }, [preferences]);

  useEffect(() => {
    if (!searchDto.sort) return;

    setDecksLoading(true);

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
          setDecksLoading(false);
        });
      } else {
        DeckService.getByUser(
          userId,
          {
            ...searchDto,
            includePrivate: user?.id === userPageUser?.id ? "true" : "false",
          },
          { page, items: 50 }
        ).then((response) => {
          setDecks(response.data);
          setMeta(response.meta);
          setDecksLoading(false);
        });
      }
    } else {
      DeckService.getMany(searchDto, { page, items: 50 }).then((response) => {
        setDecks(response.data);
        setMeta(response.meta);
        setDecksLoading(false);
      });
    }
  }, [searchDto]);

  function getDeckURL(deck: Deck) {
    return `${
      includeIds?.length
        ? "../../../"
        : collections || kits
        ? "../../"
        : userId
        ? "../"
        : ""
    }decks/${deck.id}`;
  }

  function toggleListView() {
    setLocalStorageUserPreferences({
      decksViewType: listView ? DeckViewType.CARD : DeckViewType.LIST,
    });
    setListView(!listView);
  }

  function clearFilters() {
    setSearch("");
    setCards([]);
    setCommanderSearch(" ");
    setCommanderCardSearch("");
    setPartnerSearch(" ");
    setPartnerCardSearch("");
    setPartnerCardAutoComplete([]);
    setCommanderCardSearch("");
    setCommanderCardAutoComplete([]);

    setTimeout(() => {
      setCommanderSearch("");
      setPartnerSearch("");
    }, 10);
  }

  function searchWithFilters() {
    setSearchDto({
      ...(sort && { sort }),
      ...(board && { board }),
      ...(search && { search }),
      ...(bracket && { bracket }),
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

  function updateResultsText() {
    let resultsText = "";
    let where = false;

    resultsText += `Showing ${decks?.length || 0} of ${meta?.totalItems || 0} ${
      searchDto?.deckFormat ? `${titleCase(searchDto.deckFormat)} ` : ""
    }deck${decks?.length !== 1 || searchDto?.deckFormat ? "s" : ""}`;

    if (search) {
      where = true;

      resultsText += ` with a name or card containing "${search}"`;
    }

    if (searchDto.commander) {
      if (!where) resultsText += " where ";
      else resultsText += " and ";
      where = true;

      const oathbreaker = searchDto.deckFormat === MTGFormats.OATHBREAKER;
      resultsText += `the ${
        oathbreaker ? "Oathbreaker" : "Commander"
      } is "${titleCase(searchDto.commander)}"`;

      if (searchDto.partner) {
        resultsText += ` and the ${
          oathbreaker ? "Signature Spell" : "Partner"
        } is "${titleCase(searchDto.partner)}"`;
      }
    }

    if (cards?.length) {
      if (!where) resultsText += " where ";
      else resultsText += " and ";
      where = true;

      if (cards?.length) {
        resultsText += `the deck${
          board !== BoardTypes.MAIN ? `'s ${board} board` : ""
        } contains`;

        if (cards.length === 1) resultsText += ` "${cards[0]}"`;
        if (cards.length === 2) {
          resultsText += `${
            !exclusiveCardSearch ? " at least one of " : " both "
          }"${cards.join(`" ${exclusiveCardSearch ? "and" : "or"} "`)}"`;
        } else if (cards.length > 2) {
          resultsText +=
            `${!exclusiveCardSearch ? " at least one of" : " all of"}` +
            cards.reduce((acc, card, index) => {
              if (index === cards.length - 1) {
                return acc + ` ${exclusiveCardSearch ? "and" : "or"} "${card}"`;
              } else return `${acc} "${card}",`;
            }, "");
        }
      }
    }

    if (searchDto.sort) {
      const sort =
        searchDto.sort[0] === "-"
          ? searchDto.sort.substring(1)
          : searchDto.sort;

      const sortDirection =
        searchDto.sort[0] === "-" ? SortTypes.DESC : SortTypes.ASC;

      resultsText += ` sorted by ${titleCase(sort)}${
        sortDirection === SortTypes.DESC ? " (Descending)" : "(Ascending)"
      }`;
    }

    setResultsText(resultsText);
  }

  function createDeck() {
    if (!user || !user.verified) return;

    DeckService.create({
      ...(kits ? { isKit: true } : {}),
      ...(collections
        ? { isCollection: true, format: "Collection" as any }
        : {}),
      name: `New ${kits ? "Kit" : collections ? "Collection" : "Deck"}`,
    }).then((response) => {
      localStorage.removeItem("builderCardsMain");
      localStorage.removeItem("builderCardsSide");
      localStorage.removeItem("builderCardsMaybe");
      localStorage.removeItem("builderCardsAcquire");
      localStorage.removeItem("builderKits");
      localStorage.removeItem("dashboard");

      router.push(`decks/${response.deckId}/builder/main-board`);
    });
  }

  return (
    <View className="flex gap-4">
      <View className="flex flex-row flex-wrap gap-4">
        <Input
          squareRight
          label="Search"
          placeholder="Search for a deck or card"
          value={search}
          onChange={setSearch}
          enterAction={searchWithFilters}
        />

        <Button
          size="sm"
          squareLeft
          action="primary"
          className="self-end -ml-4"
          icon={faSearch}
          disabled={decksLoading}
          onClick={searchWithFilters}
        />

        {width > 600 && (
          <View className="self-end">
            <Tooltip
              text={listView ? "Switch to Card View" : "Switch to List View"}
            >
              <Button
                size="sm"
                type="outlined"
                className="max-w-12"
                icon={listView ? faBorderAll : faList}
                onClick={toggleListView}
              />
            </Tooltip>
          </View>
        )}

        <Button
          size="sm"
          icon={faFilter}
          className="self-end"
          type={filtersOpen ? "default" : "outlined"}
          onClick={() => setFiltersOpen(!filtersOpen)}
        />
      </View>

      <View
        className={`${filtersOpen ? "max-h-[1000px]" : "max-h-0"} ${
          !overflow && "overflow-hidden"
        } flex gap-4 z-[28] transition-all duration-300`}
      >
        <View className="flex flex-row flex-wrap gap-4 z-[26]">
          <View className="flex flex-row gap-4 flex-[2] z-[24] min-w-[250px]">
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

            {width <= 600 && (
              <View className="self-end">
                <Tooltip
                  text={
                    listView ? "Switch to Card View" : "Switch to List View"
                  }
                >
                  <Button
                    size="sm"
                    type="outlined"
                    className="max-w-12"
                    icon={listView ? faBorderAll : faList}
                    onClick={toggleListView}
                  />
                </Tooltip>
              </View>
            )}
          </View>

          <View className="flex-1 z-[22] min-w-[250px]">
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
            <View className="flex-1 z-[20] min-w-[250px]">
              <Select
                label="Commander"
                value={commanderSearch}
                onChange={setCommanderSearch}
                onSearchChange={setCommanderCardSearch}
                options={commanderCardAutoComplete.map((card) => ({
                  label: card,
                  value: card,
                }))}
                placeholder={`Find a ${
                  format === MTGFormats.OATHBREAKER
                    ? "Oathbreaker"
                    : "Commander"
                }`}
                notFoundText={
                  commanderSearch
                    ? "No cards found with that name"
                    : "Enter a card name"
                }
              />
            </View>
          )}

          {!kits && commanderFormat && (
            <View className="flex-1 z-[18] min-w-[250px]">
              <Select
                label="Partner"
                value={partnerSearch}
                onChange={setPartnerSearch}
                onSearchChange={setPartnerCardSearch}
                options={partnerCardAutoComplete.map((card) => ({
                  label: card,
                  value: card,
                }))}
                placeholder={`Find a ${
                  format === MTGFormats.OATHBREAKER
                    ? "Signature Spell"
                    : "Partner"
                }`}
                notFoundText={
                  partnerSearch
                    ? "No cards found with that name"
                    : "Enter a card name"
                }
              />
            </View>
          )}

          {!kits && commanderFormat && (
            <View className="flex-1 z-[16] min-w-[250px]">
              <Select
                label="Bracket"
                placeholder="Bracket"
                value={bracket}
                onChange={setBracket}
                options={Object.values(BracketType).map((bracket) => ({
                  label: BracketNumber[bracket] + " " + bracket,
                  value: BracketNumber[bracket],
                }))}
              />
            </View>
          )}
        </View>

        <View className="flex flex-row flex-wrap gap-4 z-[14]">
          <View className="flex-[3] z-[12] min-w-[250px]">
            <Select
              multiple
              label="Cards"
              value={cards}
              onChange={setCards}
              placeholder="Find a card"
              onSearchChange={setCardSearch}
              options={cardAutoComplete.map((card) => ({
                label: card,
                value: card,
              }))}
              notFoundText={
                cardSearch
                  ? "No cards found with that name"
                  : "Enter a card name"
              }
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

        <View className="flex flex-row justify-end gap-4">
          <Button
            size="sm"
            icon={faX}
            text="Clear"
            type="outlined"
            className="lg:max-w-fit flex-1"
            onClick={clearFilters}
          />

          <Button
            size="sm"
            text="Search"
            icon={faSearch}
            disabled={decksLoading}
            className="lg:max-w-fit flex-1"
            onClick={searchWithFilters}
          />
        </View>
      </View>

      <Text size="xs" className="!text-dark-600 -mt-4">
        {resultsText}
      </Text>

      {!listView && (
        <View className="flex flex-row flex-wrap lg:justify-start justify-center gap-4 z-[10]">
          {decksLoading ? (
            loadingDecks.map((_, index) => (
              <Skeleton
                key={index}
                className="w-[296px] h-[200px] !rounded-xl"
              />
            ))
          ) : decks?.length > 0 ? (
            deckCards.map((deckCard, index) => (
              <View key={index}>{deckCard}</View>
            ))
          ) : (
            <Placeholder
              icon={faSearch}
              title={
                kits
                  ? "No Kits Found"
                  : collections
                  ? "No Collections Found"
                  : "No Decks Found"
              }
              subtitle={
                userId
                  ? kits
                    ? search
                      ? "Try searching for something else"
                      : "Create a kit and it will show up here!"
                    : collections
                    ? search
                      ? "Try searching for something else"
                      : "Create a collection and it will show up here!"
                    : search
                    ? "Try searching for something else"
                    : "Create a deck and it will show up here!"
                  : "Try adjusting your search filters to find something else!"
              }
            >
              {userId &&
                user?.verified &&
                (userPageUser ? userPageUser.id === user.id : true) && (
                  <Button
                    size="sm"
                    icon={faPlus}
                    className="self-end"
                    text={kits ? "Kit" : collections ? "Collection" : "Deck"}
                    onClick={createDeck}
                  />
                )}
            </Placeholder>
          )}
        </View>
      )}

      {listView && (
        <>
          <DecksTable
            decks={deckList}
            loading={decksLoading}
            endColumns={endColumns as any}
            rowClick={(deck: any) => router.push(`decks/${deck?.id}`)}
          />

          {!decks?.length && !decksLoading && (
            <Placeholder
              title="No Decks Found"
              subtitle="Try adjusting your search filters to find something else!"
            />
          )}
        </>
      )}

      {meta && meta.totalItems > 0 && (
        <Pagination
          meta={meta}
          center={!listView}
          onChange={(page) => setPage(page)}
        />
      )}
    </View>
  );
}
