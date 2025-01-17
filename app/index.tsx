import Text from "@/components/ui/text/text";
import React from "react";
import { Image, SafeAreaView, ScrollView, View } from "react-native";

export default function RootLayout() {
  return (
    <SafeAreaView className="flex-1 flex w-full h-full bg-dark-100">
      <ScrollView>
        <View className="relative flex-1 flex items-center justify-center w-full min-h-[100vh]">
          <Image
            source={{
              uri: "https://cards.scryfall.io/art_crop/front/4/e/4e4fb50c-a81f-44d3-93c5-fa9a0b37f617.jpg?1639436752",
            }}
            className="absolute w-full h-full"
          />

          <View className="absolute w-full h-full bg-primary-200 bg-opacity-55" />

          <View className="absolute w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent from-50% to-black to-100%" />

          <Text size="2xl" thickness="medium" className="px-6 py-4">
            Mana Locus
          </Text>
        </View>

        <View className="flex-1 flex items-center justify-center w-full min-h-[100vh] bg-blue-500">
          <Text size="2xl" thickness="medium" className="px-6 py-4">
            Second Section
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
