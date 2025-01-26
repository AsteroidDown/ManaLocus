import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import UserContext from "@/contexts/user/user.context";
import UserService from "@/hooks/services/user.service";
import { router } from "expo-router";
import React, { useContext, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const { setUser } = useContext(UserContext);

  const [login, setLogin] = React.useState(true);

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [userError, setUserError] = React.useState(false);

  useEffect(() => {
    if (userError) setUserError(false);
  }, [username, password]);

  function loginUser() {
    if (!username || !password) return;

    localStorage.clear();

    UserService.login(username, password).then((user) => {
      if (user) {
        setUser(user);
        router.push("../decks");
      } else setUserError(true);
    });
  }

  function registerUser() {
    if (!username || !password || !email) return;

    localStorage.clear();

    UserService.register(username, password, email).then(() => {
      UserService.login(username, password).then((user) => {
        if (user) {
          setUser(user);
          router.push(`../users/${user.id}`);
        }
      });
    });
  }

  return (
    <SafeAreaView className="flex-1 flex w-full h-full bg-dark-100">
      <ScrollView>
        <View className="flex-1 flex items-center justify-center w-full min-h-[100dvh] -mt-[50px]">
          <View className="flex flex-row mb-4 w-96">
            <Button
              squareRight
              text="Login"
              action="primary"
              className="flex-1"
              type={login ? "default" : "outlined"}
              onClick={() => setLogin(true)}
            />

            <Button
              squareLeft
              text="Register"
              action="primary"
              className="flex-1"
              type={login ? "outlined" : "default"}
              onClick={() => setLogin(false)}
            />
          </View>

          <View className="flex flex-row gap-4 items-start w-96 overflow-hidden">
            <View
              className={`flex gap-2 w-96 transition-all duration-300 ${
                !login ? "-ml-[400px]" : ""
              }`}
            >
              <Input
                label="Username"
                placeholder="Username or Email"
                value={username}
                error={userError}
                disabled={!login}
                onChange={setUsername}
                enterAction={() => loginUser()}
              />

              <Input
                secured
                label="Password"
                placeholder="3n7eR Y0ur P4ssw0rd"
                value={password}
                error={userError}
                disabled={!login}
                onChange={setPassword}
                errorMessage="This username and password combination does not exist"
                enterAction={() => loginUser()}
              />

              <Button
                text="Login"
                action="primary"
                className="flex-1 mt-2"
                onClick={() => loginUser()}
              />
            </View>

            <View className="flex gap-2 w-96">
              <Input
                label="Username"
                placeholder="Make it unique!"
                value={username}
                disabled={login}
                onChange={setUsername}
              />

              <Input
                label="Email"
                placeholder="you@example.com"
                value={email}
                disabled={login}
                onChange={setEmail}
              />

              <Input
                secured
                label="Password"
                placeholder="3n7eR Y0ur P4ssw0rd"
                value={password}
                disabled={login}
                onChange={setPassword}
              />

              <Input
                secured
                label="Confirm Password"
                placeholder="D0 1t Ag4in"
                value={confirmPassword}
                disabled={login}
                onChange={setConfirmPassword}
              />

              <Button
                text="Register"
                action="primary"
                className="flex-1 mt-2"
                onClick={() => registerUser()}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
