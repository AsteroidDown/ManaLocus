import React, { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { getDeck, loginUser, registerUser } from "@/hooks/api-methods";
import Text from "@/components/ui/text/text";
import { removeLocalStorageJwt } from "@/functions/local-storage/auth-token";

export default function Login() {
  const [user, setUser] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  async function logoutUser() {
    // after JWT is removed, client is considered unauthenticated
    removeLocalStorageJwt();
    setUser("Anonymous");
  }

  return (
    <View className="flex flex-row gap-8">
      <TextInput
        placeholder="Username"
        placeholderTextColor="#8b8b8b"
        onChangeText={setUsername}
        className="color-white outline-none text-base"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#8b8b8b"
        onChangeText={setPassword}
        className="color-white outline-none text-base"
      />
      <Pressable
        className="rounded-full px-4 py-2 -mx-3 -my-2"
        onPress={() => loginUser(username, password)}
      >
        <Text size="md" thickness="medium" className={"!text-background-500 "}>
          Login
        </Text>
      </Pressable>
      <Pressable
        className="rounded-full px-4 py-2 -mx-3 -my-2"
        onPress={() => registerUser(username, password)}
      >
        <Text size="md" thickness="medium" className={"!text-background-500 "}>
          Register
        </Text>
      </Pressable>
      <Pressable
        className="rounded-full px-4 py-2 -mx-3 -my-2"
        onPress={() => logoutUser()}
      >
        <Text size="md" thickness="medium" className={"!text-background-500 "}>
          Logout
        </Text>
      </Pressable>
      <Pressable
        className="rounded-full px-4 py-2 -mx-3 -my-2"
        onPress={() => getDeck(2)/* saveDeck("Awesome deck", getLocalStorageStoredCards()) */}
      >
        <Text size="md" thickness="medium" className={"!text-background-500 "}>
          Users
        </Text>
      </Pressable>
      <Text size="md" thickness="medium" className={"!text-background-500 "}>
        {user ? `Welcome, ${user}` : "Welcome, Anonymous"}
      </Text>
      <Text size="md" thickness="medium" className={"!text-red-600 "}>
          {loginError}
      </Text>
    </View>
  );
}
