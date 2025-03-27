import DeckGallery from "@/components/decks/deck-gallery";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Footer from "@/components/ui/navigation/footer";
import UserPageContext from "@/contexts/user/user-page.context";
import UserContext from "@/contexts/user/user.context";
import DeckService from "@/hooks/services/deck.service";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import { useContext } from "react";
import { SafeAreaView, View } from "react-native";

export default function UserCollectionsPage() {
  const { user } = useContext(UserContext);
  const { userPageUser } = useContext(UserPageContext);

  if (!user || !userPageUser) return null;

  function createCollection() {
    if (!user) return;

    DeckService.create({
      name: "New Collection",
      isCollection: true,
      format: "Collection" as any,
    }).then((response) => {
      localStorage.removeItem("builderCardsMain");
      localStorage.removeItem("builderCardsSide");
      localStorage.removeItem("builderCardsMaybe");
      localStorage.removeItem("builderCardsAcquire");
      localStorage.removeItem("builderKits");
      localStorage.removeItem("dashboard");

      router.push(`decks/${response.deckId}/builder/main-board`);
    });
  }

  return (
    <SafeAreaView className="flex-1 flex w-full h-full bg-background-100">
      <View className="lg:px-16 px-4 py-4 min-h-[100dvh] bg-background-100">
        <BoxHeader
          title="Collections"
          subtitle="View and manage your collections"
          end={
            <Button
              size="sm"
              icon={faPlus}
              type="outlined"
              text="Collection"
              className="self-end"
              onClick={createCollection}
            />
          }
        />

        <DeckGallery noLoadScreen collections userId={userPageUser.id} />
      </View>

      <Footer />
    </SafeAreaView>
  );
}
