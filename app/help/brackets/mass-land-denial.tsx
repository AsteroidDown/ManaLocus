import SpecialCardList from "@/components/cards/special-card-list";
import Footer from "@/components/ui/navigation/footer";
import Sidebar from "@/components/ui/navigation/sidebar";
import Text from "@/components/ui/text/text";
import { MassLandDenial } from "@/constants/mtg/brackets";
import { Link } from "expo-router";
import { View } from "react-native";
import { HelpSections } from "../_layout";

export default function MassLandDenialPage() {
  const identifiers = MassLandDenial.map((card) => ({
    name: card,
  }));

  return (
    <View className="flex">
      <View className="flex flex-row">
        <Sidebar current="Mass Land Denial" sections={HelpSections} />

        <SpecialCardList
          title="Mass Land Denial"
          identifiers={identifiers}
          subtitle={
            <View className="gap-2 mt-2">
              <Text size="sm">
                Mass Land Denial is used to lock opponents out of the game. This
                list of mass land denial is managed by ManaLocus, and if you
                notice an inconsistency please contact us at{" "}
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
                The official Wizards of the Coast summary of mass land denial:
              </Text>

              <View className="flex gap-2 pl-4 mt-2 border-l-2 border-l-dark-300">
                <Text size="md" className="italic">
                  These cards regularly destroy, exile, and bounce other lands,
                  keep lands tapped, or change what mana is produced by four or
                  more lands per player without replacing them.
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
