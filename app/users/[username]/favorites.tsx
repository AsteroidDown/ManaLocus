import DeckGallery from "@/components/decks/deck-gallery";
import BoxHeader from "@/components/ui/box/box-header";
import Footer from "@/components/ui/navigation/footer";
import UserPageContext from "@/contexts/user/user-page.context";
import UserContext from "@/contexts/user/user.context";
import { useContext } from "react";
import { SafeAreaView, View } from "react-native";

export default function UserFavoritesPage() {
  const { user } = useContext(UserContext);
  const { userPageUser } = useContext(UserPageContext);

  if (!userPageUser) return null;

  return (
    <SafeAreaView className="flex-1 flex w-full h-full bg-background-100">
      <View className="lg:px-16 px-4 py-4 min-h-[100dvh] bg-background-100">
        <BoxHeader
          title={`${
            user?.id === userPageUser.id ? "Your" : `${userPageUser.name}'s`
          } Favorites`}
          subtitle={
            user?.id === userPageUser?.id
              ? "View and manage the decks you've favorited"
              : `See what decks ${userPageUser.name} has favorited`
          }
        />

        <DeckGallery noLoadScreen favorites userId={userPageUser.id} />
      </View>

      <Footer />
    </SafeAreaView>
  );
}
