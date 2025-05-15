import Footer from "@/components/ui/navigation/footer";
import Sidebar from "@/components/ui/navigation/sidebar";
import Text from "@/components/ui/text/text";
import { Link } from "expo-router";
import { View } from "react-native";
import { HelpSections } from "./_layout";

export default function HelpPage() {
  return (
    <View className="flex">
      <View className="flex flex-row">
        <Sidebar current="General" sections={HelpSections} />

        <View className="flex-1 flex gap-4 lg:px-16 px-4 py-4 min-h-[100dvh] bg-dark-100">
          <Text size="xl" weight="bold">
            General
          </Text>

          <Text size="md" weight="medium">
            About Us
          </Text>

          <Text className="-mt-2">
            Welcome to ManaLocus! ManaLocus is a fan run, community driven,
            open-source, Magic: The Gathering deck builder and companion app.
            ManaLocus was created by AsteroidDown, a developer and deck builder
            who wanted to create a more accessible and user friendly way to
            build decks and manage collections. Originally created to help
            organize cubes, ManaLocus has grown quite a bit since the
            spreadsheet it once was, and we're excited to see where it goes!
          </Text>

          <Text size="md" weight="medium">
            Contact
          </Text>

          <Text className="-mt-2">
            The best ways to get in touch with us are via our{" "}
            <Link
              href="https://discord.gg/qmsPDd9pva"
              className="text-primary-400"
            >
              Discord
            </Link>{" "}
            server, or by emailing us at{" "}
            <Link
              href="mailto:support@manalocus.com"
              className="text-primary-400"
            >
              support@manalocus.com
            </Link>
          </Text>
        </View>
      </View>

      <Footer />
    </View>
  );
}
