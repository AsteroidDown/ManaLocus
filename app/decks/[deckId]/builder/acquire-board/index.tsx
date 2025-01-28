import CardItemGallery from "@/components/cards/card-item-gallery";
import BuilderPreferencesContext from "@/contexts/cards/builder-preferences.context";
import BodyHeightContext from "@/contexts/ui/body-height.context";
import BuilderHeightContext from "@/contexts/ui/builder-height.context";
import React, { useContext, useRef } from "react";
import { View } from "react-native";

export default function CardsByCostPage() {
  const { bodyHeight, setBodyHeight } = useContext(BodyHeightContext);
  const { builderHeight } = useContext(BuilderHeightContext);
  const { preferences } = useContext(BuilderPreferencesContext);

  const containerRef = useRef<View>(null);

  const buffer = 24;

  if (!builderHeight) return;

  return (
    <View
      className="!bg-background-100 min-h-fit"
      ref={containerRef}
      onLayout={() =>
        containerRef.current?.measureInWindow((_x, _y, _width, height) => {
          if (!height) return;
          setBodyHeight(height + builderHeight + buffer);
        })
      }
    >
      <CardItemGallery
        type="cost"
        hideImages={preferences.hideCardImages || false}
        groupMulticolored={preferences.groupMulticolored || false}
      />
    </View>
  );
}
