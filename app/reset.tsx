import Button from "@/components/ui/button/button";
import Divider from "@/components/ui/divider/divider";
import Input from "@/components/ui/input/input";
import Footer from "@/components/ui/navigation/footer";
import Text from "@/components/ui/text/text";
import ToastContext from "@/contexts/ui/toast.context";
import { decode } from "@/functions/encoding";
import UserService from "@/hooks/services/user.service";
import { User } from "@/models/user/user";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";

export default function ResetPage() {
  const { token } = useLocalSearchParams();
  const { addToast } = useContext(ToastContext);

  const [user, setUser] = useState(null as User | null);
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState(false);
  const [passwordLength, setPasswordLength] = useState(false);
  const [passwordUpper, setPasswordUpper] = useState(false);
  const [passwordLower, setPasswordLower] = useState(false);
  const [passwordNumber, setPasswordNumber] = useState(false);
  const [passwordSpecial, setPasswordSpecial] = useState(false);

  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useEffect(() => {
    if (!token || typeof token !== "string") return;

    const decoded = decode(token, process.env.RESET_SECRET);
    UserService.getByEmail(decoded).then((foundUser) => {
      if (!foundUser) router.push("");
      else setUser(foundUser);
    });
  }, [token]);

  useEffect(() => {
    if (confirmPassword.length < password.length - 2) return;

    if (password !== confirmPassword) setPasswordsMatch(true);
    else setPasswordsMatch(false);
  }, [password, confirmPassword]);

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

  function resetPassword() {
    if (
      !user ||
      !password ||
      password !== confirmPassword ||
      !validatePassword(password)
    ) {
      return;
    }

    setLoading(true);

    UserService.update(user.id, { password }).then(() => {
      setLoading(false);
      addToast({
        duration: 10000,
        action: "success",
        title: "Password Reset!",
        subtitle: "Your password has been reset and you may now login",
        content: (
          <Button
            size="xs"
            type="clear"
            text="Login"
            className="ml-auto"
            onClick={() => router.push(`login`)}
          />
        ),
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
    <SafeAreaView>
      <View className="flex flex-row justify-center flex-1 gap-4 lg:px-16 px-4 py-4 min-h-[100dvh] bg-background-100">
        <View className="flex gap-2 w-96 mt-8">
          <Text size="md" weight="semi">
            Reset Password {user ? `for ${user.name}` : ""}
          </Text>

          <Divider thick />

          <Input
            secured
            label="Password"
            placeholder="3n7eR Y0ur P4ssw0rd"
            value={password}
            disabled={loading}
            error={passwordError}
            onChange={setPassword}
            enterAction={resetPassword}
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
            disabled={loading}
            error={passwordsMatch}
            value={confirmPassword}
            enterAction={resetPassword}
            onChange={setConfirmPassword}
            errorMessage="Passwords do not match"
          />

          <Button
            size="sm"
            text="Reset Password"
            action="primary"
            className="flex-1 mt-2"
            disabled={
              !confirmPassword ||
              loading ||
              !user ||
              passwordsMatch ||
              passwordError
            }
            onClick={resetPassword}
            icon={loading ? faRotate : undefined}
          />
        </View>
      </View>

      <Footer />
    </SafeAreaView>
  );
}
