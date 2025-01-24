import CardItemGallery from "@/components/cards/card-item-gallery";
import BuilderPreferencesContext from "@/contexts/cards/builder-preferences.context";
import React, { useContext } from "react";

export default function CardsByCostPage() {
  const { preferences } = useContext(BuilderPreferencesContext);

  return (
    <CardItemGallery
      type="cost"
      hideImages={preferences.hideCardImages || false}
      groupMulticolored={preferences.groupMulticolored || false}
    />
  );
}
