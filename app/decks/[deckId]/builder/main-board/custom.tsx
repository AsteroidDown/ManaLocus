import CardItemGallery from "@/components/cards/card-item-gallery";
import BuilderPreferencesContext from "@/contexts/cards/builder-preferences.context";
import React, { useContext } from "react";

export default function CardsCustomPage() {
  const { preferences } = useContext(BuilderPreferencesContext);

  return (
    <CardItemGallery
      type="custom"
      hideImages={preferences.hideCardImages || false}
      groupMulticolored={preferences.groupMulticolored || false}
    />
  );
}
