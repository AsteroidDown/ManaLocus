import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import UserContext from "@/contexts/user/user.context";
import UserService from "@/hooks/services/user.service";
import React, { useContext } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const { setUser } = useContext(UserContext);

  const [login, setLogin] = React.useState(true);

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  function loginUser() {
    UserService.login(username, password).then((user) => {
      if (user) setUser(user);
    });
  }

  function registerUser() {
    UserService.register(username, password, email).then(() => {
      UserService.login(username, password).then((user) => {
        if (user) setUser(user);
      });
    });
  }

  return (
    <SafeAreaView className="flex-1 flex w-full h-full bg-dark-100">
      <ScrollView>
        <View className="flex-1 flex items-center justify-center w-full min-h-[100vh] -mt-[50px]">
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
                disabled={!login}
                value={username}
                onChange={(change) => setUsername(change)}
              />

              <Input
                secured
                label="Password"
                placeholder="3n7eR Y0ur P4ssw0rd"
                disabled={!login}
                value={password}
                onChange={(change) => setPassword(change)}
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
                onChange={(change) => setUsername(change)}
              />

              <Input
                label="Email"
                placeholder="you@example.com"
                value={email}
                disabled={login}
                onChange={(change) => setEmail(change)}
              />

              <Input
                secured
                label="Password"
                placeholder="3n7eR Y0ur P4ssw0rd"
                value={password}
                disabled={login}
                onChange={(change) => setPassword(change)}
              />

              <Input
                secured
                label="Confirm Password"
                placeholder="D0 1t Ag4in"
                value={confirmPassword}
                disabled={login}
                onChange={(change) => setConfirmPassword(change)}
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
