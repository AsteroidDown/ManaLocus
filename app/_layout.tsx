import Footer from "@/components/ui/navigation/footer";
import Header from "@/components/ui/navigation/header";
import LoadingView from "@/components/ui/navigation/loading";
import BodyHeightContext from "@/contexts/ui/body-height.context";
import LoadingContext from "@/contexts/ui/loading.context";
import UserPreferencesContext from "@/contexts/user/user-preferences.context";
import UserContext from "@/contexts/user/user.context";
import { getLocalStorageUserPreferences } from "@/functions/local-storage/user-preferences-local-storage";
import "@/global.css";
import UserService from "@/hooks/services/user.service";
import { UserPreferences } from "@/models/preferences/user-preferences";
import { User } from "@/models/user/user";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";

export default function RootLayout() {
  const [bodyHeight, setBodyHeight] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState(null as User | null);
  const [preferences, setPreferences] = React.useState(
    null as UserPreferences | null
  );

  useEffect(() => {
    UserService.refresh().then(() => {
      if (localStorage.getItem("user-access")) {
        UserService.getCurrentUser().then((user) => user && setUser(user));
      }
    });

    setPreferences(getLocalStorageUserPreferences());
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <UserPreferencesContext.Provider value={{ preferences, setPreferences }}>
        <BodyHeightContext.Provider value={{ bodyHeight, setBodyHeight }}>
          <LoadingContext.Provider value={{ loading, setLoading }}>
            <Header />

            <ScrollView className="flex w-full bg-background-100">
              <View className="min-h-[100dvh]" style={{ height: bodyHeight }}>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="users" />
                  <Stack.Screen name="login" />
                  <Stack.Screen name="+not-found" />
                </Stack>
              </View>

              <LoadingView />

              <Footer />
            </ScrollView>
          </LoadingContext.Provider>
        </BodyHeightContext.Provider>
      </UserPreferencesContext.Provider>
    </UserContext.Provider>
  );
}
