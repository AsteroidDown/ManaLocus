import DeckGallery from "@/components/decks/deck-gallery";
import UserContext from "@/contexts/user/user.context";
import { useContext } from "react";
import { SafeAreaView, View } from "react-native";

export default function UserFavoritesPage() {
  const { user } = useContext(UserContext);

  if (!user) return null;

  return (
    <SafeAreaView className="flex-1 flex w-full h-full bg-background-100">
      <View className="my-4">
        <DeckGallery favorites userId={user.id} />
      </View>
    </SafeAreaView>
  );
}
