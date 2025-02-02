import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import BodyHeightContext from "@/contexts/ui/body-height.context";
import UserContext from "@/contexts/user/user.context";
import UserService from "@/hooks/services/user.service";
import { router } from "expo-router";
import React, { useContext, useEffect, useRef } from "react";
import { SafeAreaView, View } from "react-native";

export default function Login() {
  const { setUser } = useContext(UserContext);
  const { setBodyHeight } = useContext(BodyHeightContext);

  const containerRef = useRef<SafeAreaView>(null);

  const [login, setLogin] = React.useState(true);

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [userError, setUserError] = React.useState(false);

  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordLength, setPasswordLength] = React.useState(false);
  const [passwordUpper, setPasswordUpper] = React.useState(false);
  const [passwordLower, setPasswordLower] = React.useState(false);
  const [passwordNumber, setPasswordNumber] = React.useState(false);
  const [passwordSpecial, setPasswordSpecial] = React.useState(false);

  const [passwordsMatch, setPasswordsMatch] = React.useState(false);

  useEffect(() => {
    if (userError) setUserError(false);
  }, [username, password]);

  useEffect(() => {
    if (
      passwordLength ||
      passwordUpper ||
      passwordLower ||
      passwordNumber ||
      passwordSpecial
    ) {
      setPasswordError(true);
    } else setPasswordError(false);
  }, [
    passwordLength,
    passwordUpper,
    passwordLower,
    passwordNumber,
    passwordSpecial,
  ]);

  useEffect(() => {
    if (confirmPassword.length < password.length - 2) return;

    if (password !== confirmPassword) setPasswordsMatch(true);
    else setPasswordsMatch(false);
  });

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
    if (
      !username ||
      !password ||
      !email ||
      password !== confirmPassword ||
      !validatePassword(password)
    ) {
      return;
    }

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

  function validatePassword(password: string) {
    let passwordLengthCheck = false;
    let passwordUpperCheck = false;
    let passwordLowerCheck = false;
    let passwordNumberCheck = false;
    let passwordSpecialCheck = false;

    if (password.length < 8) {
      passwordLengthCheck = true;
    } else {
      passwordLengthCheck = false;
    }

    if (!password.match(/[A-Z]/g)) {
      passwordUpperCheck = true;
    } else {
      passwordUpperCheck = false;
    }

    if (!password.match(/[a-z]/g)) {
      passwordLowerCheck = true;
    } else {
      passwordLowerCheck = false;
    }

    if (!password.match(/[0-9]/g)) {
      passwordNumberCheck = true;
    } else {
      passwordNumberCheck = false;
    }

    if (!password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g)) {
      passwordSpecialCheck = true;
    } else {
      passwordSpecialCheck = false;
    }

    if (passwordLengthCheck) setPasswordLength(true);
    else setPasswordLength(false);

    if (passwordUpperCheck) setPasswordUpper(true);
    else setPasswordUpper(false);

    if (passwordLowerCheck) setPasswordLower(true);
    else setPasswordLower(false);

    if (passwordNumberCheck) setPasswordNumber(true);
    else setPasswordNumber(false);

    if (passwordSpecialCheck) setPasswordSpecial(true);
    else setPasswordSpecial(false);

    const passwordValid =
      !passwordLengthCheck &&
      !passwordUpperCheck &&
      !passwordLowerCheck &&
      !passwordNumberCheck &&
      !passwordSpecialCheck;

    return passwordValid;
  }

  return (
    <SafeAreaView
      className="flex-1 flex w-full h-full bg-dark-100"
      ref={containerRef}
      onLayout={() =>
        containerRef.current?.measureInWindow((_x, _y, _width, height) =>
          setBodyHeight(height)
        )
      }
    >
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
              error={passwordError}
              errorMessage={`${
                passwordLength
                  ? "Password must be at least 8 characters long\n"
                  : ""
              }${
                passwordUpper
                  ? "Password must contain at least one uppercase letter\n"
                  : ""
              }${
                passwordLower
                  ? "Password must contain at least one lowercase letter\n"
                  : ""
              }${
                passwordNumber
                  ? "Password must contain at least one number\n"
                  : ""
              }${
                passwordSpecial
                  ? "Password must contain at least one special character\n"
                  : ""
              }`}
            />

            <Input
              secured
              label="Confirm Password"
              placeholder="D0 1t Ag4in"
              value={confirmPassword}
              disabled={login}
              onChange={setConfirmPassword}
              error={passwordsMatch}
              errorMessage="Passwords do not match"
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
    </SafeAreaView>
  );
}
