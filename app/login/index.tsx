import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import Footer from "@/components/ui/navigation/footer";
import ToastContext from "@/contexts/ui/toast.context";
import UserContext from "@/contexts/user/user.context";
import UserService from "@/hooks/services/user.service";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";

export default function Login() {
  const { setUser } = useContext(UserContext);
  const { addToast } = useContext(ToastContext);

  const [login, setLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [userError, setUserError] = useState(false);

  const [passwordError, setPasswordError] = useState(false);
  const [passwordLength, setPasswordLength] = useState(false);
  const [passwordUpper, setPasswordUpper] = useState(false);
  const [passwordLower, setPasswordLower] = useState(false);
  const [passwordNumber, setPasswordNumber] = useState(false);
  const [passwordSpecial, setPasswordSpecial] = useState(false);

  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    localStorage.clear();

    UserService.login(username, password).then((user) => {
      setLoading(false);

      if (user) {
        setUser(user);
        router.push("../decks");

        addToast({
          action: "success",
          title: "Logged In!",
          subtitle: `Welcome back, ${user.name}!`,
        });
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

    setLoading(true);
    localStorage.clear();

    UserService.register(username, password, email).then(() => {
      UserService.login(username, password).then((user) => {
        setLoading(false);

        if (user) {
          setUser(user);
          router.push(`../users/${user.id}`);

          addToast({
            action: "success",
            title: "Registered!",
            subtitle: `Welcome to Mana Locus, ${username}!`,
          });
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
    <SafeAreaView className="flex-1 flex w-full h-full bg-dark-100">
      <View className="flex-1 flex items-center justify-center w-full min-h-[100dvh] -mt-[50px]">
        <View className="flex flex-row mb-4 w-96">
          <Button
            size="sm"
            squareRight
            text="Login"
            action="primary"
            className="flex-1"
            type={login ? "default" : "outlined"}
            onClick={() => setLogin(true)}
          />

          <Button
            size="sm"
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
              size="sm"
              text="Login"
              action="primary"
              className="flex-1 mt-2"
              disabled={loading}
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
              size="sm"
              text="Register"
              action="primary"
              className="flex-1 mt-2"
              disabled={loading}
              onClick={() => registerUser()}
            />
          </View>
        </View>
      </View>

      <Footer />
    </SafeAreaView>
  );
}
