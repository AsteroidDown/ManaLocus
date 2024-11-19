import Button from "@/components/ui/button/button";
import Text from "@/components/ui/text/text";
import UserContext from "@/contexts/user/user.context";
import UserService from "@/hooks/services/user.service";
import React, { useContext } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const { user, setUser } = useContext(UserContext);

  function logout() {
    UserService.logout().then(() => setUser(null));
  }

  return (
    <SafeAreaView className="flex-1 flex w-full h-full bg-dark-100">
      <ScrollView>
        <View className="flex-1 flex flex-row justify-between w-full min-h-[100vh] px-11 py-8 bg-background-100">
          <Text size="2xl" thickness="medium">
            {user?.name}
          </Text>

          <Button text="Logout" action="danger" onClick={() => logout()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
