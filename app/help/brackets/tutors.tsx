import SpecialCardList from "@/components/cards/special-card-list";
import Footer from "@/components/ui/navigation/footer";
import Sidebar from "@/components/ui/navigation/sidebar";
import Text from "@/components/ui/text/text";
import { Tutors } from "@/constants/mtg/brackets";
import { Link } from "expo-router";
import { View } from "react-native";
import { HelpSections } from "../_layout";

export default function TutorsPage() {
  const identifiers = Tutors.map((card) => ({
    name: card,
  }));

  return (
    <View className="flex">
      <View className="flex flex-row">
        <Sidebar current="Tutors" sections={HelpSections} />

        <SpecialCardList
          title="Tutors"
          identifiers={identifiers}
          subtitle={
            <View className="gap-2 mt-2">
              <Text size="sm">
                Tutors are powerful cards that help fetch game-winning pieces
                from your deck. This list of tutors is managed by ManaLocus, and
                if you notice an inconsistency please contact us at{" "}
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
                To learn more about tutors and commander brackets, please visit
                the{" "}
                <Link
                  className="text-primary-400"
                  href="https://magic.wizards.com/en/news/announcements/introducing-commander-brackets-beta"
                >
                  official article from Wizards of the Coast
                </Link>
              </Text>
            </View>
          }
        />
      </View>

      <Footer />
    </View>
  );
}
