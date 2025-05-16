import Footer from "@/components/ui/navigation/footer";
import Sidebar from "@/components/ui/navigation/sidebar";
import Text from "@/components/ui/text/text";
import { BracketNumber, Brackets, BracketType } from "@/constants/mtg/brackets";
import { Link } from "expo-router";
import { View } from "react-native";
import { HelpSections } from "../_layout";

export default function BracketsPage() {
  return (
    <View className="flex -z-[1]">
      <View className="flex flex-row">
        <Sidebar current="Brackets" sections={HelpSections} />

        <View className="flex flex-1 gap-2 lg:px-16 px-4 py-4 min-h-[100dvh] bg-dark-100">
          <Text size="xl" weight="bold">
            Brackets
          </Text>
          <Text>
            Commander Brackets were introduced in{" "}
            <Link
              className="text-primary-400"
              href="https://magic.wizards.com/en/news/announcements/introducing-commander-brackets-beta"
            >
              February 11, 2025 by Wizards of the Coast
            </Link>
            . Brackets are used to help determine better matchmaking between
            players. ManaLocus tries to help players by providing bracket
            suggestions based of the content of their decks. The rules ManaLocus
            uses to determine a deck's bracket are defined as follows:
          </Text>

          <BracketGuidelines
            bracketType={BracketType.Exhibition}
            quote="Throw down with your ultra-casual commander deck! Winning is not the
          primary goal here, as it's more about showing off something unusual
          you've made. Villains yelling in the art? Everything has the number 4?
          Oops, all Horses? Those are all fair game! The games here are likely
          to go long, and end slowly. Just focus on having fun and enjoying what
          the table has brought!"
          />

          <BracketGuidelines
            bracketType={BracketType.Core}
            quote="The easiest reference point is that the average current
              preconstructed deck is at a Core level. While they may not have
              every perfect card, they are certainly tuned with the potential
              for big, splashy turns and strong engines, and are built in a way
              that they work toward winning the game. While the game is unlikely
              to end out of nowhere, and generally go nine or more turns, you
              can expect big swings. The deck usually has some cards that aren't
              perfect from a gameplay perspective, but there just because they
              bring a smile to your face, or fit the overall theme of the deck."
          />
          <BracketGuidelines
            bracketType={BracketType.Upgraded}
            quote="These decks are souped up and ready to play beyond the strength of an
          average precon! They are full of carefully selected cards, with work
          having gone into figuring out the best card for each slot. The games
          tend to be a little faster as well, ending a turn or two sooner than
          your Core decks. This also is where players can begin playing up to
          three cards from the Game Changer list, amping up the decks further.
          Of course, it doesn't have to have any game changers to be a bracket 3
          deck: many decks are more powerful than a precon even without them!
          These decks should generally not have any two-card infinite combos
          that can happen cheaply and in about the first six or so turns of the
          game, but it's possible the long game could end with one being
          deployed, even out of nowhere."
          />
          <BracketGuidelines
            bracketType={BracketType.Optimized}
            quote="It's time to go wild! Bring out your strongest decks and cards. You
          can expect to see explosive starts, strong tutors, cheap combos that
          end games, mass land destruction, or one player's deck be full of
          cards off the Game Changer List. This is high power commander, and
          games have the potential to end pretty quickly. The focus here is on
          bringing the best version of the deck you want to play — not built
          around a tournament metagame. It's shuffling up your strong and fully
          optimized deck, whatever it may be, and seeing how it fares. For the
          majority of Commander players, this is the highest power Commander you
          will interact with."
          />
          <BracketGuidelines
            bracketType={BracketType.CEDH}
            quote="This is high power with a very competitive and metagame focused
          mindset. Mindset is a key part of that description: much of it is in
          how you approach the format and deckbuilding. It's not just no-holds
          barred you playing your most powerful cards like the Optimized
          bracket, it's carefully planned: there is care paid into following and
          paying attention to a metagame and tournament structure, and no
          sacrifices are made in deckbuilding as you try to be the one to win
          the pod. Additionally, there is special care and attention played to
          behavior and tableside negotiation (such as not making spite plays or
          concessions) that play into the tournament structure. CEDH is where
          winning matters more than self expression. You might not be playing
          your favorite cards or commanders, as pet cards are usually replaced
          with cards needed in the meta, but you're playing what you think will
          be most likely to win."
          />
        </View>
      </View>

      <Footer />
    </View>
  );
}

function BracketGuidelines({
  bracketType,
  quote,
}: {
  bracketType: BracketType;
  quote?: string;
}) {
  const bracket = Brackets[bracketType];

  const bracketsHref =
    "https://magic.wizards.com/en/news/announcements/introducing-commander-brackets-beta";
  return (
    <View className="flex gap-2">
      <Text size="lg" weight="semi" className="mt-2">
        Bracket {BracketNumber[bracketType]}: {bracketType}
      </Text>

      <View className="flex gap-1 ml-4 mb-2 pl-4 border-l-2 border-l-dark-300">
        <Text className="italic">{quote}</Text>

        <Text>
          <Link href={bracketsHref} className="text-primary-400">
            Official article from Wizards of the Coast
          </Link>
        </Text>
      </View>

      <Text>{bracketType} deck building requirements:</Text>

      <View className="flex -mt-2 ml-4">
        <Text>
          -
          {bracket.gameChangers
            ? bracket.maxGameChangers
              ? " Up to " + (bracket.maxGameChangers || 0) + " "
              : " Any number of "
            : " No "}
          <Link
            href="/help/brackets/game-changers"
            className="text-primary-400"
          >
            Game Changers
          </Link>
        </Text>

        <Text>
          -
          {bracket.tutors
            ? bracket.maxTutors
              ? " Up to " + (bracket.maxTutors || 0) + " "
              : " Any number of "
            : " No "}
          <Link href="/help/brackets/tutors" className="text-primary-400">
            Tutors
          </Link>
        </Text>

        <Text>
          -
          {bracket.extraTurns
            ? bracket.chainingExtraTurns
              ? " Chaining "
              : " No Chaining "
            : " No "}
          <Link href="/help/brackets/extra-turns" className="text-primary-400">
            Extra Turns
          </Link>
          {bracket.chainingExtraTurns ? " allowed" : ""}
        </Text>

        <Text>
          -{!bracket.massLandDenial ? " No " : " "}
          <Link
            href="/help/brackets/mass-land-denial"
            className="text-primary-400"
          >
            Mass Land Denial
          </Link>
          {bracket.massLandDenial ? " allowed" : ""}
        </Text>

        <Text>
          -{!bracket.twoCardInfinites ? " No two " : " Two "}card combos
          {bracket.twoCardInfinites ? " allowed" : ""}
        </Text>
      </View>
    </View>
  );
}
