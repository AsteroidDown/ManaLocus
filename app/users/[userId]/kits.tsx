import DeckGallery from "@/components/decks/deck-gallery";
import UserPageContext from "@/contexts/user/user-page.context";
import UserContext from "@/contexts/user/user.context";
import { useContext } from "react";
import { SafeAreaView, View } from "react-native";

export default function UserKitsPage() {
  const { user } = useContext(UserContext);
  const { userPageUser } = useContext(UserPageContext);

  if (!user || !userPageUser) return null;

  return (
    <SafeAreaView className="flex-1 flex w-full h-full bg-background-100">
      <View className="my-4">
        <DeckGallery kits userId={userPageUser.id} />
      </View>
    </SafeAreaView>
  );
}
