import Button from "@/components/ui/button/button";
import Divider from "@/components/ui/divider/divider";
import Input from "@/components/ui/input/input";
import Footer from "@/components/ui/navigation/footer";
import Text from "@/components/ui/text/text";
import { EmailType } from "@/constants/emails";
import ToastContext from "@/contexts/ui/toast.context";
import UserContext from "@/contexts/user/user.context";
import { encode } from "@/functions/encoding";
import EmailService from "@/hooks/services/email.service";
import UserService from "@/hooks/services/user.service";
import { faArrowRight, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Pressable, SafeAreaView, View } from "react-native";

export default function Login() {
  const { addToast } = useContext(ToastContext);
  const { user, setUser } = useContext(UserContext);

  const [login, setLogin] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);

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
    if (user) router.push(`users/${user.id}`);
  }, [user]);

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

    UserService.register(username, password, email, {
      username,
      verifyUrl: `${process.env.BASE_URL}/verify?token=${encode(
        username,
        process.env.VERIFICATION_SECRET
      )}`,
    }).then(() => {
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

  async function sendResetEmail() {
    if (!email) return;
    setLoading(true);

    const foundUser = await UserService.getByEmail(email);

    if (!foundUser) {
      setLoading(false);
      addToast({
        action: "danger",
        title: "No User Found",
        subtitle: "No user found with that email",
      });
      return;
    }

    EmailService.send<EmailType.FORGOT_PASSWORD>(
      EmailType.FORGOT_PASSWORD,
      foundUser.email,
      "Reset Password",
      {
        username: foundUser.name,
        resetUrl: `${process.env.BASE_URL}/reset?token=${encode(
          foundUser.email,
          process.env.RESET_SECRET
        )}`,
      }
    ).then(() => {
      setLoading(false);
      addToast({
        action: "success",
        title: "Reset Email Sent!",
        subtitle: "Check your email for a password reset link",
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
        <View className="flex flex-row gap-4 items-start w-96 overflow-hidden">
          <View
            className={`flex gap-2 w-96 transition-all duration-300 ${
              forgotPassword ? "" : "-ml-[400px]"
            }`}
          >
            <Pressable
              className="flex flex-row justify-between items-center"
              onPress={() => setForgotPassword(false)}
            >
              <Text size="md" weight="semi">
                Forgot Password
              </Text>

              <Button
                rounded
                type="clear"
                action="default"
                icon={faArrowRight}
                onClick={() => setForgotPassword(false)}
              />
            </Pressable>

            <Divider thick />
          </View>

          <View className="flex flex-row mb-4 w-96">
            <Button
              size="sm"
              squareRight
              text="Login"
              action="primary"
              className="flex-1"
              type={login ? "default" : "outlined"}
              onClick={() => setLogin(false)}
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
        </View>

        <View className="flex flex-row gap-4 items-start w-96 overflow-hidden">
          <View
            className={`flex gap-2 w-96 mt-4 transition-all duration-300 ${
              forgotPassword ? "" : login ? "-ml-[400px]" : "-ml-[800px]"
            }`}
          >
            <Input
              label="Email to send reset link"
              placeholder="Enter your email"
              value={email}
              onChange={setEmail}
              enterAction={sendResetEmail}
            />

            <Button
              size="sm"
              action="primary"
              icon={faEnvelope}
              className="flex-1 mt-2"
              text="Send Reset Email"
              disabled={loading}
              onClick={sendResetEmail}
            />
          </View>

          <View className="flex gap-2 w-96">
            <Input
              label="Username"
              placeholder="Username or Email"
              value={username}
              error={userError}
              disabled={!login}
              onChange={setUsername}
              enterAction={loginUser}
            />

            <Input
              secured
              label="Password"
              placeholder="3n7eR Y0ur P4ssw0rd"
              value={password}
              error={userError}
              disabled={!login}
              onChange={setPassword}
              enterAction={loginUser}
              errorMessage="This username and password combination does not exist"
            />

            <Button
              size="sm"
              text="Login"
              action="primary"
              className="flex-1 mt-2"
              disabled={loading}
              onClick={loginUser}
            />

            <Button
              size="xs"
              type="clear"
              action="primary"
              text="Forgot Password?"
              className="mt-2 max-w-fit ml-auto"
              disabled={loading}
              onClick={() => setForgotPassword(true)}
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
              disabled={login}
              error={passwordsMatch}
              value={confirmPassword}
              onChange={setConfirmPassword}
              errorMessage="Passwords do not match"
            />

            <Button
              size="sm"
              text="Register"
              action="primary"
              className="flex-1 mt-2"
              disabled={loading || passwordError || passwordsMatch}
              onClick={registerUser}
            />
          </View>
        </View>
      </View>

      <Footer />
    </SafeAreaView>
  );
}
