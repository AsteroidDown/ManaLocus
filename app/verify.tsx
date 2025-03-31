import Button from "@/components/ui/button/button";
import Footer from "@/components/ui/navigation/footer";
import Text from "@/components/ui/text/text";
import UserContext from "@/contexts/user/user.context";
import { decode } from "@/functions/encoding";
import { updateLocalStorageUser } from "@/functions/local-storage/user-local-storage";
import UserService from "@/hooks/services/user.service";
import { faCheck, faRotate } from "@fortawesome/free-solid-svg-icons";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";

export default function VerifyPage() {
  const { token } = useLocalSearchParams();

  const { user, setUser } = useContext(UserContext);

  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    if (user?.verified) {
      setVerifying(false);
      return;
    }

    if (!user || !token || typeof token !== "string") return;

    const decoded = decode(token, process.env.VERIFICATION_SECRET);
    if (!decoded || decoded !== user.name) return;

    setTimeout(
      () =>
        UserService.verify().then(() => {
          setVerifying(false);

          UserService.getCurrentUser().then((user) => {
            if (!user) return;

            setUser(user);
            updateLocalStorageUser(user);
          });
        }),
      3000
    );
  }, [user, token]);

  return (
    <SafeAreaView>
      <View className="flex flex-row justify-center flex-1 gap-4 lg:px-16 px-4 py-4 min-h-[100dvh] bg-background-100">
        <View className="flex flex-col justify-center -mt-10">
          {verifying && (
            <Button
              type="clear"
              disabled={verifying}
              icon={verifying ? faRotate : faCheck}
              text={verifying ? "Verifying..." : "Verified!"}
            />
          )}

          {!verifying &&
            (user?.verified ? (
              <View className="flex gap-2 items-center">
                <Text size="md" weight="bold">
                  You've successfully been verified
                </Text>

                <Text>You may exit this page</Text>
              </View>
            ) : (
              <View className="flex gap-2 items-center">
                <Text size="md" weight="bold">
                  You are not verified
                </Text>

                <Text>
                  Please log in and go to your user settings to verify your
                  account
                </Text>
              </View>
            ))}
        </View>
      </View>

      <Footer />
    </SafeAreaView>
  );
}
