import Footer from "@/components/ui/navigation/footer";
import Text from "@/components/ui/text/text";
import React from "react";
import { Image, View } from "react-native";

export default function RootLayout() {
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

      <Footer />
    </View>
  );
}
