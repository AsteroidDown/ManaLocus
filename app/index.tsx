import Text from "@/components/ui/text/text";
import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

export default function RootLayout() {
  return (
    <SafeAreaView className="flex-1 flex w-full h-full bg-dark-100">
      <ScrollView>
        <View className="flex-1 flex items-center justify-center w-full min-h-[100vh]">
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
