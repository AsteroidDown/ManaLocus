import DeckGallery from "@/components/decks/deck-gallery";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Footer from "@/components/ui/navigation/footer";
import Text from "@/components/ui/text/text";
import Tooltip from "@/components/ui/tooltip/tooltip";
import UserPageContext from "@/contexts/user/user-page.context";
import UserContext from "@/contexts/user/user.context";
import DeckService from "@/hooks/services/deck.service";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import { useContext } from "react";
import { SafeAreaView, View } from "react-native";

export default function UserKitsPage() {
  const { user } = useContext(UserContext);
  const { userPageUser } = useContext(UserPageContext);

  if (!userPageUser) return null;

  function createKit() {
    if (!user || !user.verified) return;

    DeckService.create({
      isKit: true,
      name: "New Kit",
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
          title={`${
            user?.id === userPageUser.id ? "Your" : `${userPageUser.name}'s`
          } Kits`}
          subtitle={
            <View className="flex items-start">
              <Text>
                {user?.id === userPageUser.id
                  ? "View and manage your kits"
                  : `See what kits ${userPageUser.name} uses`}
              </Text>
              {user?.id === userPageUser.id &&
                (user?.access?.kitCount || 0) > 0 && (
                  <Tooltip text="To get more kit space, join our Patreon!">
                    <Text center italic size="xs" className="!text-dark-600">
                      (Kits created {user?.kitCount}/{user?.access?.kitCount})
                    </Text>
                  </Tooltip>
                )}
            </View>
          }
          end={
            user &&
            userPageUser.id === user.id &&
            user.verified && (
              <Button
                size="sm"
                text="Kit"
                type="outlined"
                icon={faPlus}
                className="self-end"
                onClick={createKit}
                disabled={
                  (user?.access?.kitCount || 0) > 0 &&
                  (user?.kitCount || 0) >= (user?.access?.kitCount || 0)
                }
              />
            )
          }
        />

        <DeckGallery noLoadScreen kits userId={userPageUser.id} />
      </View>

      <Footer />
    </SafeAreaView>
  );
}
