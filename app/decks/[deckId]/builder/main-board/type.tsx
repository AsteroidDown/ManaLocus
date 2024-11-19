import CardItemGallery from "@/components/cards/card-item-gallery";
import CardPreferencesContext from "@/contexts/cards/card-preferences.context";
import React, { useContext } from "react";

export default function CardsByTypePage() {
  const { preferences } = useContext(CardPreferencesContext);
  return (
    <CardItemGallery
      type="type"
      condensed={preferences.cardsCondensed || false}
      hideImages={preferences.hideCardImages || false}
    />
  );
}
