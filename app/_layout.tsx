import Button from "@/components/ui/button/button";
import Text from "@/components/ui/text/text";
import UserPreferencesContext from "@/contexts/user/user-preferences.context";
import UserContext from "@/contexts/user/user.context";
import { getLocalStorageUserPreferences } from "@/functions/local-storage/user-preferences-local-storage";
import "@/global.css";
import UserService from "@/hooks/services/user.service";
import { UserPreferences } from "@/models/preferences/user-preferences";
import { User } from "@/models/user/user";
import { Link, Stack } from "expo-router";
import React, { useContext, useEffect } from "react";
import { SafeAreaView, View } from "react-native";

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
        <SafeAreaView className="flex w-full h-full bg-background-100">
          <Stack
            screenOptions={{
              headerTitle: () => <Logo />,
              headerTintColor: "rgb(var(--background-200))",
              headerStyle: {
                height: 48,
                borderBottomWidth: 0,
                backgroundColor: "black",
              },
              headerLeft: () => null,
              headerRight: () => <Login />,
            }}
          >
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

function Logo() {
  return (
    <View className="flex flex-row items-center gap-2 px-6 py-4">
      <Link href="/">
        <Text size="2xl" thickness="medium" className="mr-2">
          Mana Locus
        </Text>
      </Link>

      <Link href="/decks">
        <Button square type="clear" text="Decks" size="lg" />
      </Link>

      <Link href="/cards">
        <Button square type="clear" text="Cards" size="lg" />
      </Link>

      <Button square type="clear" text="Explore" size="lg" />
    </View>
  );
}

function Login() {
  const { user } = useContext(UserContext);

  return (
    <View className="flex flex-row items-center gap-2 px-6 py-4">
      {user ? (
        <Link href={`/users/${user.id}`}>
          <Button square type="clear" size="lg" text={user.name} />
        </Link>
      ) : (
        <Link href="/login">
          <Button square type="clear" text="Login" size="lg" />
        </Link>
      )}
    </View>
  );
}
