import DeckCard from "@/components/decks/deck-card";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Divider from "@/components/ui/divider/divider";
import Input from "@/components/ui/input/input";
import Select from "@/components/ui/input/select";
import Text from "@/components/ui/text/text";
import { MTGFormats } from "@/constants/mtg/mtg-format";
import UserContext from "@/contexts/user/user.context";
import { titleCase } from "@/functions/text-manipulation";
import DeckService from "@/hooks/services/deck.service";
import { Deck } from "@/models/deck/deck";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { Link } from "expo-router";
import React, { useContext, useEffect } from "react";
import { ScrollView, View } from "react-native";

export default function DecksPage() {
  const { user } = useContext(UserContext);

  const [decks, setDecks] = React.useState([] as Deck[]);

  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [format, setFormat] = React.useState(null as MTGFormats | null);

  useEffect(() => {
    DeckService.getMany({
      ...(search && { search }),
      ...(format && { deckFormat: format }),
    }).then((decks) => setDecks(decks));
  }, [user, format, search]);

  function createDeck() {
    if (!user) return;

    DeckService.create({});
  }

  return (
    <ScrollView>
      <View className="flex flex-1 gap-4 px-16 py-8 min-h-[100vh] bg-background-100">
        <BoxHeader
          title="Find Decks"
          className="!pb-0"
          end={user && <Button text="Create Deck" onClick={createDeck} />}
        />

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
          className={`${
            filtersOpen ? "max-h-[1000px]" : "max-h-0"
          } flex gap-4 overflow-hidden transition-all duration-300`}
        >
          <View className="flex gap-2 z-[11]">
            <Text size="lg" thickness="bold">
              Filters
            </Text>

            <Divider thick className="!border-background-200" />

            <Select
              label="Format"
              value={format}
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
          </View>

          {/* <View className="flex gap-2 z-10">
            <Text size="lg" thickness="bold">
              Sort Options
            </Text>

            <Divider thick className="!border-background-200" />

            <Select
              label="Format"
              value={format}
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
          </View> */}
        </View>

        <View className="flex flex-row flex-wrap gap-4">
          {decks?.map((deck, index) => (
            <Link key={deck.id + index} href={`decks/${deck.id}`}>
              <DeckCard deck={deck} />
            </Link>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
