import Icon from "@/components/ui/icon/icon";
import Footer from "@/components/ui/navigation/footer";
import Text from "@/components/ui/text/text";
import { BlueskyURL, DiscordURL, PatreonURL } from "@/constants/urls";
import {
  faBluesky,
  faDiscord,
  faPatreon,
} from "@fortawesome/free-brands-svg-icons";
import React from "react";
import { Image, Linking, Pressable, View } from "react-native";

export default function RootLayout() {
  const baseCardClasses =
    "flex-1 flex gap-2 items-center justify-center h-48 min-w-80 border-2 bg-gradient-to-b from-35% rounded-xl hover:shadow-[0_0_16px] transition-all duration-300";

  return (
    <View className="flex-1">
      <View className="relative flex-1 flex items-center justify-center w-full min-h-[100dvh]">
        <Image
          source={{
            uri: "https://cards.scryfall.io/art_crop/front/4/e/4e4fb50c-a81f-44d3-93c5-fa9a0b37f617.jpg?1639436752",
          }}
          className="absolute w-full h-full"
        />

        <View className="absolute w-full h-full bg-primary-200 bg-opacity-55" />

        <View className="absolute w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent from-50% to-black to-100%" />

        <Image
          resizeMode="contain"
          className="max-h-36 max-w-36 -mt-16"
          source={require("assets/Logo.png")}
        />

        <Text size="2xl" weight="medium" className="px-6 pt-4">
          Mana Locus
        </Text>

        <Text size="lg" className="px-6 italic">
          Make a Splash
        </Text>
      </View>

      <View className="flex items-center justify-center gap-4 lg:px-16 px-8 py-4 bg-background-100">
        <Text size="2xl" weight="semi">
          Want to stay connected?
        </Text>

        <View className="flex-1 flex flex-row flex-wrap gap-6 mb-4">
          <Pressable
            onPress={() => Linking.openURL(DiscordURL)}
            className={`${baseCardClasses} border-discord from-discord/80 to-discord/55 hover:shadow-discord`}
          >
            <Icon icon={faDiscord} className="text-[64px]" />

            <Text size="lg" weight="medium">
              Discord
            </Text>
            <Text size="sm">Join our deck building community</Text>
          </Pressable>

          <Pressable
            onPress={() => Linking.openURL(PatreonURL)}
            className={`${baseCardClasses} border-patreon from-patreon/80 to-patreon/55 hover:shadow-patreon`}
          >
            <Icon icon={faPatreon} className="text-[64px]" />

            <Text size="lg" weight="medium">
              Patreon
            </Text>
            <Text size="sm">Support us for as little as $3 CAD a month</Text>
          </Pressable>

          <Pressable
            onPress={() => Linking.openURL(BlueskyURL)}
            className={`${baseCardClasses} border-bluesky from-bluesky/80 to-bluesky/55 hover:shadow-bluesky`}
          >
            <Icon icon={faBluesky} className="text-[64px]" />

            <Text size="lg" weight="medium">
              Bluesky
            </Text>
            <Text size="sm">See what we've been up to</Text>
          </Pressable>
        </View>
      </View>

      <Footer />
    </View>
  );
}
