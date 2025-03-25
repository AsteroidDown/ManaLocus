import CardItemGallery from "@/components/cards/card-item-gallery";
import Footer from "@/components/ui/navigation/footer";
import BuilderPreferencesContext from "@/contexts/cards/builder-preferences.context";
import React, { useContext } from "react";
import { View } from "react-native";

export default function CardsCustomPage() {
  const { preferences } = useContext(BuilderPreferencesContext);

  return (
    <View className="flex-1 flex">
      <CardItemGallery
        type="custom"
        hideImages={preferences.hideCardImages || false}
        groupMulticolored={preferences.groupMulticolored || false}
      />

      <Footer />
    </View>
  );
}
