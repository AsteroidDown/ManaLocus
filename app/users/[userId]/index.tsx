import DeckGallery from "@/components/decks/deck-gallery";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Text from "@/components/ui/text/text";
import UserContext from "@/contexts/user/user.context";
import UserService from "@/hooks/services/user.service";
import { router } from "expo-router";
import React, { useContext } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const { user, setUser } = useContext(UserContext);

  function logout() {
    UserService.logout().then(() => {
      setUser(null);
      router.push("../..");
    });
  }

  if (!user) return null;

  return (
    <SafeAreaView className="flex-1 flex w-full h-full bg-dark-100">
      <ScrollView>
        <View className="flex-1 flex gap-4 w-full min-h-[100vh] px-16 py-8 bg-background-100">
          <View className="flex flex-row justify-between">
            <Text size="2xl" thickness="medium">
              {user?.name}
            </Text>

            <Button text="Logout" action="danger" onClick={() => logout()} />
          </View>

          <BoxHeader title="Your Decks" className="!pb-0" />

          <DeckGallery userId={user.id} />
        </View>

        <DeckGallery />
      </ScrollView>
    </SafeAreaView>
  );
}
