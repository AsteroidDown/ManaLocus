import { TabProps } from "@/components/ui/tabs/tab";
import TabBar from "@/components/ui/tabs/tab-bar";
import Text from "@/components/ui/text/text";
import UserPageContext from "@/contexts/user/user-page.context";
import UserContext from "@/contexts/user/user.context";
import "@/global.css";
import UserService from "@/hooks/services/user.service";
import { User } from "@/models/user/user";
import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect } from "react";
import { SafeAreaView, View } from "react-native";

export default function UserLayout() {
  const { userId } = useLocalSearchParams();

  const { user, setUser } = useContext(UserContext);

  const [userPageUser, setPageUser] = React.useState(null as User | null);

  useEffect(() => {
    if (typeof userId !== "string") return;

    if (userId === user?.id) setPageUser(user);
    else UserService.get(userId).then((foundUser) => setPageUser(foundUser));
  }, [userId]);

  if (!user || !userPageUser) return null;

  const tabs: TabProps[] = [
    {
      title: "Decks",
      link: `users/${userPageUser.id}`,
      name: "decks",
    },
    {
      title: "Favorites",
      link: `users/${userPageUser.id}/favorites`,
      name: "favorites",
    },
    {
      title: "Kits",
      link: `users/${userPageUser.id}/kits`,
      name: "kits",
    },
    {
      title: "Folders",
      link: `users/${userPageUser.id}/folders`,
      name: "folders",
    },
  ];

  if (user.id === userPageUser.id) {
    tabs.push({
      title: "Settings",
      link: `users/${userPageUser.id}/settings`,
      name: "settings",
    });
  }

  return (
    <UserPageContext.Provider value={{ userPageUser, setPageUser }}>
      <SafeAreaView className="flex w-full h-full bg-background-100">
        <View className="flex-1 flex gap-4 w-full min-h-[100dvh] lg:px-16 px-4 py-8 bg-background-100">
          <View className="flex flex-row justify-between">
            <Text size="2xl" thickness="medium">
              {userPageUser?.name}
            </Text>
          </View>

          <TabBar hideBorder tabs={tabs} />
        </View>
      </SafeAreaView>
    </UserPageContext.Provider>
  );
}
