import Header from "@/components/ui/navigation/header";
import UserPreferencesContext from "@/contexts/user/user-preferences.context";
import UserContext from "@/contexts/user/user.context";
import { getLocalStorageUserPreferences } from "@/functions/local-storage/user-preferences-local-storage";
import "@/global.css";
import UserService from "@/hooks/services/user.service";
import { UserPreferences } from "@/models/preferences/user-preferences";
import { User } from "@/models/user/user";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";

export default function RootLayout() {
  const [user, setUser] = React.useState(null as User | null);
  const [preferences, setPreferences] = React.useState(
    null as UserPreferences | null
  );

  useEffect(() => {
    UserService.getCurrentUser().then((user) => setUser(user));

    setPreferences(getLocalStorageUserPreferences());
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <UserPreferencesContext.Provider value={{ preferences, setPreferences }}>
        <Header />

        <SafeAreaView className="flex w-full h-[95dvh] bg-background-100">
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="users" />
            <Stack.Screen name="login" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </SafeAreaView>
      </UserPreferencesContext.Provider>
    </UserContext.Provider>
  );
}
