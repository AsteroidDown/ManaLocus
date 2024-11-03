import Text from "@/components/ui/text/text";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  return (
    <SafeAreaView className="flex-1 flex w-full h-full bg-dark-100">
      <ScrollView>
        <View className="flex-1 flex items-center justify-center w-full min-h-[100vh] -mt-[50px]">
          <Text size="2xl" thickness="medium" className="px-6 py-4">
            Login
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
