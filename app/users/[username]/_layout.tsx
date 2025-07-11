import BoxHeader from "@/components/ui/box/box-header";
import Chip from "@/components/ui/chip/chip";
import { TabProps } from "@/components/ui/tabs/tab";
import TabBar from "@/components/ui/tabs/tab-bar";
import UserPageContext from "@/contexts/user/user-page.context";
import UserContext from "@/contexts/user/user.context";
import "@/global.css";
import UserService from "@/hooks/services/user.service";
import { User } from "@/models/user/user";
import { faPatreon } from "@fortawesome/free-brands-svg-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";

export default function UserLayout() {
  const { username } = useLocalSearchParams();

  const { user } = useContext(UserContext);

  const [userPageUser, setPageUser] = useState(null as User | null);

  useEffect(() => {
    if (typeof username !== "string") return;

    if (username === user?.name) setPageUser(user);
    else {
      UserService.get({ username }).then((foundUser) => setPageUser(foundUser));
    }
  }, [username]);

  if (!userPageUser) return null;

  const tabs: TabProps[] = [
    {
      title: "Decks",
      link: `users/${userPageUser.name}`,
      name: "decks",
    },
    {
      title: "Collections",
      link: `users/${userPageUser.name}/collections`,
      name: "collections",
    },
    {
      title: "Favorites",
      link: `users/${userPageUser.name}/favorites`,
      name: "favorites",
    },
    {
      title: "Kits",
      link: `users/${userPageUser.name}/kits`,
      name: "kits",
    },
    {
      title: "Folders",
      link: `users/${userPageUser.name}/folders`,
      name: "folders",
    },
  ];

  if (user?.id === userPageUser.id) {
    tabs.push(
      {
        title: "Trades",
        link: `users/${userPageUser.name}/trades`,
        name: "settings",
      },
      {
        title: "Settings",
        link: `users/${userPageUser.name}/settings`,
        name: "settings",
      }
    );
  }

  return (
    <UserPageContext.Provider value={{ userPageUser, setPageUser }}>
      <SafeAreaView className="flex w-full h-full bg-background-100">
        <View className="lg:px-16 px-4 mt-4">
          <BoxHeader
            title={userPageUser?.name}
            titleEnd={
              userPageUser?.patreon && (
                <Chip
                  size="sm"
                  type="outlined"
                  action="primary"
                  startIcon={faPatreon as any}
                  text={userPageUser.patreon.tierName}
                />
              )
            }
          />
        </View>

        <TabBar tabs={tabs} containerClasses="lg:px-16 px-4" />
      </SafeAreaView>
    </UserPageContext.Provider>
  );
}
