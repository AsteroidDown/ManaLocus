import Button from "@/components/ui/button/button";
import { TabProps } from "@/components/ui/tabs/tab";
import TabBar from "@/components/ui/tabs/tab-bar";
import Text from "@/components/ui/text/text";
import UserPageContext from "@/contexts/user/user-page.context";
import UserContext from "@/contexts/user/user.context";
import "@/global.css";
import UserService from "@/hooks/services/user.service";
import { User } from "@/models/user/user";
import { router, useLocalSearchParams } from "expo-router";
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

  const isPageUser = user.id === userPageUser.id;

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
  ];

  if (isPageUser) {
    tabs.push({
      title: "Settings",
      link: `users/${userPageUser.id}/settings`,
      name: "settings",
    });
  }

  function logout() {
    UserService.logout().then(() => {
      setUser(null);
      router.push("../..");
    });
  }

  return (
    <UserPageContext.Provider value={{ userPageUser, setPageUser }}>
      <SafeAreaView className="flex w-full h-full bg-background-100">
        <View className="flex-1 flex gap-4 w-full min-h-[100vh] px-16 py-8 bg-background-100">
          <View className="flex flex-row justify-between">
            <Text size="2xl" thickness="medium">
              {userPageUser?.name}
            </Text>

            {isPageUser && (
              <Button text="Logout" action="danger" onClick={() => logout()} />
            )}
          </View>

          <TabBar hideBorder tabs={tabs} />
        </View>
      </SafeAreaView>
    </UserPageContext.Provider>
  );
}
