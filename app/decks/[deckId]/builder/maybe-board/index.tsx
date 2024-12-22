import CardItemGallery from "@/components/cards/card-item-gallery";
import CardPreferencesContext from "@/contexts/cards/card-preferences.context";
import React, { useContext } from "react";

export default function CardsByCostPage() {
  const { preferences } = useContext(CardPreferencesContext);
  return (
    <CardItemGallery
      type="cost"
      hideImages={preferences.hideCardImages || false}
      groupMulticolored={preferences.groupMulticolored || false}
    />
  );
}
