import CardItemGallery from "@/components/cards/card-item-gallery";
import BuilderPreferencesContext from "@/contexts/cards/builder-preferences.context";
import React, { useContext } from "react";

export default function CardsByColorPage() {
  const { preferences } = useContext(BuilderPreferencesContext);
  return (
    <CardItemGallery
      type="color"
      hideImages={preferences.hideCardImages || false}
      groupMulticolored={preferences.groupMulticolored || false}
    />
  );
}
