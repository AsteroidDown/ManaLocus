import Header from "@/components/ui/navigation/header";
import LoadingView from "@/components/ui/navigation/loading";
import ToastProvider from "@/components/ui/toast/toast-provider";
import {
  PreferenceColor,
  PreferenceColorHues,
  PreferenceColorMap,
} from "@/constants/ui/colors";
import LoadingContext from "@/contexts/ui/loading.context";
import UserPreferencesContext from "@/contexts/user/user-preferences.context";
import UserContext from "@/contexts/user/user.context";
import { getLocalStorageJwt } from "@/functions/local-storage/auth-token-local-storage";
import {
  getLocalStorageUser,
  removeLocalStorageUser,
  updateLocalStorageUser,
} from "@/functions/local-storage/user-local-storage";
import { getLocalStorageUserPreferences } from "@/functions/local-storage/user-preferences-local-storage";
import "@/global.css";
import UserService from "@/hooks/services/user.service";
import { UserPreferences } from "@/models/preferences/user-preferences";
import { User } from "@/models/user/user";
import { createTheme, ThemeProvider } from "@mui/material";
import { Stack } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Host } from "react-native-portalize";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function RootLayout() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null as User | null);
  const [preferences, setPreferences] = useState(
    null as UserPreferences | null
  );

  const access = getLocalStorageJwt()?.access;

  useEffect(() => {
    if (user) return;

    const savedUser = getLocalStorageUser();

    if (!savedUser || !access) {
      removeLocalStorageUser();
      return;
    }

    if (moment(savedUser.lastLogin).isAfter(moment().subtract(3, "days"))) {
      setUser(savedUser);

      UserService.getCurrentUser().then((currentUser) => {
        if (currentUser) {
          updateLocalStorageUser(currentUser);
          setUser(getLocalStorageUser());
        } else {
          removeLocalStorageUser();
        }
      });
    } else {
      UserService.login(savedUser.name, savedUser.password).then((user) => {
        if (!user) {
          removeLocalStorageUser();
        } else {
          setUser(user);
          updateLocalStorageUser(user, savedUser.password);
        }
      });
    }
  }, []);

  useEffect(() => {
    const preferences = getLocalStorageUserPreferences();
    setPreferences(preferences);

    Object.values(PreferenceColorHues).forEach((hue) => {
      document.documentElement.style.setProperty(
        `--${hue}`,
        PreferenceColorMap[preferences?.color ?? PreferenceColor.DEFAULT][hue]
      );
    });
  }, []);

  return (
    <Host>
      <UserContext.Provider value={{ user, setUser }}>
        <ThemeProvider theme={darkTheme}>
          <UserPreferencesContext.Provider
            value={{ preferences, setPreferences }}
          >
            <LoadingContext.Provider value={{ loading, setLoading }}>
              <ToastProvider>
                <Header />

                <ScrollView className="flex w-full bg-background-100">
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="users" />
                    <Stack.Screen name="login" />
                    <Stack.Screen name="reset" />
                    <Stack.Screen name="verify" />
                    <Stack.Screen name="+not-found" />
                  </Stack>

                  <LoadingView />
                </ScrollView>
              </ToastProvider>
            </LoadingContext.Provider>
          </UserPreferencesContext.Provider>
        </ThemeProvider>
      </UserContext.Provider>
    </Host>
  );
}
