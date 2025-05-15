import SpecialCardList from "@/components/cards/special-card-list";
import Footer from "@/components/ui/navigation/footer";
import Sidebar from "@/components/ui/navigation/sidebar";
import Text from "@/components/ui/text/text";
import { GameChangers } from "@/constants/mtg/brackets";
import { Link } from "expo-router";
import { View } from "react-native";
import { HelpSections } from "../_layout";

export default function GameChangersPage() {
  const identifiers = GameChangers.map((card) => ({
    name: card,
  }));

  return (
    <View className="flex">
      <View className="flex flex-row">
        <Sidebar current="Game Changers" sections={HelpSections} />

        <SpecialCardList
          title="Game Changers"
          identifiers={identifiers}
          subtitle={
            <View className="gap-2 mt-2">
              <Text size="sm">
                Game Changers are powerful cards that can reshape commander
                games. The list of game changers is managed by Wizards of the
                Coast, and we try to keep our copy up to date, but if you notice
                an inconsistency please contact us at{" "}
                <Link
                  className="text-primary-400"
                  href="mailto:support@manalocus.com"
                >
                  manalocus@gmail.com
                </Link>{" "}
                or on our{" "}
                <Link
                  className="text-primary-400"
                  href="https://discord.gg/qmsPDd9pva"
                >
                  Discord
                </Link>
                .
              </Text>
            </View>
          }
          description={
            <View className="mt-4">
              <Text size="sm">
                The official Wizards of the Coast summary of game changers:
              </Text>

              <View className="flex gap-2 pl-4 mt-2 border-l-2 border-l-dark-300">
                <Text size="md" className="italic">
                  Game Changers dramatically warp Commander games, allowing
                  players to run away with resources, shift games in ways that
                  many players dislike, block people from play, efficiently
                  search for their strongest cards, or have commanders that tend
                  to take away from more casual games.
                </Text>

                <Text>
                  <Link
                    className="text-primary-400"
                    href="https://magic.wizards.com/en/news/announcements/introducing-commander-brackets-beta"
                  >
                    Official article from Wizards of the Coast
                  </Link>
                </Text>
              </View>
            </View>
          }
        />
      </View>

      <Footer />
    </View>
  );
}
