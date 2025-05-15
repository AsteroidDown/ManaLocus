import Footer from "@/components/ui/navigation/footer";
import Sidebar from "@/components/ui/navigation/sidebar";
import Text from "@/components/ui/text/text";
import { Link } from "expo-router";
import { View } from "react-native";
import { HelpSections } from "../_layout";

export default function ContactPage() {
  return (
    <View className="flex">
      <View className="flex flex-row">
        <Sidebar current="Contact" sections={HelpSections} />

        <View className="flex-1 flex gap-4 lg:px-16 px-4 py-4 min-h-[100dvh] bg-dark-100">
          <Text size="xl" weight="bold">
            Contact
          </Text>

          <Text>
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

          <Text className="-mt-2">
            We try to respond as soon as possible to all inquiries, wether it be
            a bug report, feature request, or anything else! However, ManaLocus
            is a fan run service, and we won't be able to respond to every
            inquiry.
          </Text>
        </View>
      </View>

      <Footer />
    </View>
  );
}
