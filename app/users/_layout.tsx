import Button from "@/components/ui/button/button";
import { TabProps } from "@/components/ui/tabs/tab";
import TabBar from "@/components/ui/tabs/tab-bar";
import Text from "@/components/ui/text/text";
import UserContext from "@/contexts/user/user.context";
import "@/global.css";
import UserService from "@/hooks/services/user.service";
import { router } from "expo-router";
import React, { useContext } from "react";
import { SafeAreaView, View } from "react-native";

export default function UserLayout() {
  const { user, setUser } = useContext(UserContext);

  if (!user) return null;

  const tabs: TabProps[] = [
    {
      title: "Your Decks",
      link: `users/${user.id}`,
      name: "decks",
    },
    {
      title: "Favorites",
      link: `users/${user.id}/favorites`,
      name: "favorites",
    },
    {
      title: "Settings",
      link: `users/${user.id}/settings`,
      name: "settings",
    },
  ];

  function logout() {
    UserService.logout().then(() => {
      setUser(null);
      router.push("../..");
    });
  }

  return (
    <SafeAreaView className="flex w-full h-full bg-background-100">
      <View className="flex-1 flex gap-4 w-full min-h-[100vh] px-16 py-8 bg-background-100">
        <View className="flex flex-row justify-between">
          <Text size="2xl" thickness="medium">
            {user?.name}
          </Text>

          <Button text="Logout" action="danger" onClick={() => logout()} />
        </View>

        <TabBar hideBorder tabs={tabs} />
      </View>
    </SafeAreaView>
  );
}
