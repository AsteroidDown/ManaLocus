import Button from "@/components/ui/button/button";
import Footer from "@/components/ui/navigation/footer";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView, View } from "react-native";

export default function VerifyPage() {
  useEffect(() => {
    setTimeout(
      () => router.push("https://www.youtube.com/watch?v=2qBlE2-WL60"),
      1500
    );
  }, []);

  return (
    <SafeAreaView>
      <View className="flex flex-row justify-center flex-1 gap-4 lg:px-16 px-4 py-4 min-h-[100dvh] bg-background-100">
        <View className="flex flex-col justify-center -mt-10">
          <Button disabled type="clear" icon={faRotate} text="loading..." />
        </View>
      </View>

      <Footer />
    </SafeAreaView>
  );
}
