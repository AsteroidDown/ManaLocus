import DeckCard from "@/components/decks/deck-card";
import BoxHeader from "@/components/ui/box/box-header";
import { MTGFormats } from "@/constants/mtg/mtg-format";
import { Deck } from "@/models/deck/deck";
import React from "react";
import { ScrollView, View } from "react-native";

export default function DecksPage() {
  const decks: Deck[] = [
    {
      id: "1",
      userId: "1",
      user: { id: "1", name: "User 1", email: "user1@manalocus.com" },
      name: "Omnath, Locus of Creation",
      featuredArtUrl:
        "https://cards.scryfall.io/art_crop/front/4/e/4e4fb50c-a81f-44d3-93c5-fa9a0b37f617.jpg?1639436752",
      format: MTGFormats.COMMANDER,
      colors: ["W", "U", "R", "G"],
      cards: ["1", "2", "3", "4", "5"],
    },
    {
      id: "2",
      userId: "2",
      user: { id: "2", name: "User 2", email: "user2@manalocus.com" },
      name: "Roalesk, Apex Hybrid",
      featuredArtUrl:
        "https://cards.scryfall.io/art_crop/front/a/5/a52a5f4b-d2e1-405e-82b4-ea35ab851c42.jpg?1673485159",
      format: MTGFormats.COMMANDER,
      colors: ["U", "G"],
      cards: ["1", "2", "3", "4", "5"],
    },
    {
      id: "3",
      userId: "3",
      user: { id: "3", name: "User 3", email: "user3@manalocus.com" },
      name: "Landless Belcher",
      featuredArtUrl:
        "https://cards.scryfall.io/art_crop/front/7/f/7f945594-2f11-471c-b992-1b70d82c8164.jpg?1674092392",
      format: MTGFormats.MODERN,
      colors: ["U"],
      cards: ["1", "2", "3", "4", "5"],
    },
  ];

  return (
    <ScrollView>
      <View className="flex flex-1 gap-4 px-11 py-8 min-h-[100vh] bg-background-100">
        <BoxHeader title="Find Decks" className="!pb-0" />

        <View className="flex flex-row flex-wrap gap-4">
          {decks.map((deck, index) => (
            <DeckCard key={deck.id + index} deck={deck} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
