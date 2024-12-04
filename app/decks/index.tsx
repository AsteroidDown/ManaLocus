import DeckCard from "@/components/decks/deck-card";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import Select from "@/components/ui/input/select";
import { MTGFormats } from "@/constants/mtg/mtg-format";
import UserContext from "@/contexts/user/user.context";
import { titleCase } from "@/functions/text-manipulation";
import DeckService from "@/hooks/services/deck.service";
import { Deck } from "@/models/deck/deck";
import { Link } from "expo-router";
import React, { useContext, useEffect } from "react";
import { ScrollView, View } from "react-native";

export default function DecksPage() {
  const { user } = useContext(UserContext);

  const [decks, setDecks] = React.useState([] as Deck[]);

  const [search, setSearch] = React.useState("");
  const [format, setFormat] = React.useState(null as MTGFormats | null);

  useEffect(() => {
    DeckService.getMany({
      search: search ?? undefined,
      deckFormat: format ?? undefined,
    }).then((decks) => setDecks(decks));
  }, [user, format, search]);

  function createDeck() {
    if (!user) return;

    DeckService.create({});
  }

  return (
    <ScrollView>
      <View className="flex flex-1 gap-4 px-11 py-8 min-h-[100vh] bg-background-100">
        <BoxHeader
          title="Find Decks"
          className="!pb-0"
          end={user && <Button text="Create Deck" onClick={createDeck} />}
        />

        <View className="flex flex-row flex-wrap gap-4 z-10">
          <Input
            label="Search"
            placeholder="Search for a deck or card"
            value={search}
            onChange={setSearch}
          />

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
