import Footer from "@/components/ui/navigation/footer";
import Header from "@/components/ui/navigation/header";
import LoadingView from "@/components/ui/navigation/loading";
import ToastProvider from "@/components/ui/toast/toast-provider";
import {
  PreferenceColor,
  PreferenceColorHues,
  PreferenceColorMap,
} from "@/constants/ui/colors";
import BodyHeightContext from "@/contexts/ui/body-height.context";
import LoadingContext from "@/contexts/ui/loading.context";
import UserPreferencesContext from "@/contexts/user/user-preferences.context";
import UserContext from "@/contexts/user/user.context";
import { getLocalStorageJwt } from "@/functions/local-storage/auth-token-local-storage";
import { getLocalStorageUserPreferences } from "@/functions/local-storage/user-preferences-local-storage";
import "@/global.css";
import UserService from "@/hooks/services/user.service";
import { UserPreferences } from "@/models/preferences/user-preferences";
import { User } from "@/models/user/user";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

export default function RootLayout() {
  const [bodyHeight, setBodyHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null as User | null);
  const [preferences, setPreferences] = useState(
    null as UserPreferences | null
  );

  useEffect(() => {
    if (!user && getLocalStorageJwt()?.access) {
      UserService.getCurrentUser().then((user) => setUser(user));
    }

    const preferences = getLocalStorageUserPreferences();
    setPreferences(preferences);

    if (preferences?.color) {
      Object.values(PreferenceColorHues).forEach((hue) => {
        document.documentElement.style.setProperty(
          `--${hue}`,
          PreferenceColorMap[preferences.color ?? PreferenceColor.DEFAULT][hue]
        );
      });
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <UserPreferencesContext.Provider value={{ preferences, setPreferences }}>
        <BodyHeightContext.Provider value={{ bodyHeight, setBodyHeight }}>
          <LoadingContext.Provider value={{ loading, setLoading }}>
            <ToastProvider>
              <Header />

              <ScrollView className="flex w-full bg-background-100">
                <View className="min-h-[100dvh]" style={{ height: bodyHeight }}>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="users" />
                    <Stack.Screen name="login/index" />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                </View>

                <LoadingView />

                <Footer />
              </ScrollView>
            </ToastProvider>
          </LoadingContext.Provider>
        </BodyHeightContext.Provider>
      </UserPreferencesContext.Provider>
    </UserContext.Provider>
  );
}
