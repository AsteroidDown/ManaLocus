import SpecialCardList from "@/components/cards/special-card-list";
import Footer from "@/components/ui/navigation/footer";
import Sidebar from "@/components/ui/navigation/sidebar";
import Text from "@/components/ui/text/text";
import { ExtraTurns } from "@/constants/mtg/brackets";
import { Link } from "expo-router";
import { View } from "react-native";
import { HelpSections } from "../_layout";

export default function ExtraTurnsPage() {
  const identifiers = ExtraTurns.map((card) => ({
    name: card,
  }));

  return (
    <View className="flex">
      <View className="flex flex-row">
        <Sidebar current="Extra Turns" sections={HelpSections} />

        <SpecialCardList
          title="Extra Turns"
          identifiers={identifiers}
          subtitle={
            <View className="gap-2 mt-2">
              <Text size="sm">
                Extra Turns are used ensure you'll have more opportunities than
                your opponents. This list of extra turn effects is managed by
                ManaLocus, and if you notice an inconsistency please contact us
                at{" "}
                <Link
                  className="text-primary-400"
                  href="mailto:support@manalocus.com"
                >
                  support@manalocus.com
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
                To learn more about extra turn effects and commander brackets,
                please visit the{" "}
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
