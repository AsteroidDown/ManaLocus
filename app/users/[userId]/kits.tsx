import DeckGallery from "@/components/decks/deck-gallery";
import BodyHeightContext from "@/contexts/ui/body-height.context";
import UserPageContext from "@/contexts/user/user-page.context";
import UserContext from "@/contexts/user/user.context";
import { useContext, useRef } from "react";
import { SafeAreaView, View } from "react-native";

export default function UserKitsPage() {
  const { user } = useContext(UserContext);
  const { userPageUser } = useContext(UserPageContext);
  const { setBodyHeight } = useContext(BodyHeightContext);

  const containerRef = useRef<View>(null);

  if (!user || !userPageUser) return null;

  return (
    <SafeAreaView className="flex-1 flex w-full h-full bg-background-100">
      <View
        className="my-4"
        ref={containerRef}
        onLayout={() =>
          containerRef.current?.measureInWindow((_x, _y, _width, height) =>
            setBodyHeight(height)
          )
        }
      >
        <DeckGallery kits userId={userPageUser.id} />
      </View>
    </SafeAreaView>
  );
}
