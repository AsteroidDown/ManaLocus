import DashboardSectionView from "@/components/dashboard/dashboard-section";
import Button from "@/components/ui/button/button";
import Footer from "@/components/ui/navigation/footer";
import { MTGColor, MTGColors } from "@/constants/mtg/mtg-colors";
import StoredCardsContext from "@/contexts/cards/stored-cards.context";
import DashboardContext from "@/contexts/dashboard/dashboard.context";
import { getLocalStorageStoredCards } from "@/functions/local-storage/card-local-storage";
import {
  addLocalStorageDashboardItem,
  addLocalStorageDashboardSection,
  getLocalStorageDashboard,
  setLocalStorageDashboard,
} from "@/functions/local-storage/dashboard-local-storage";
import { Card } from "@/models/card/card";
import { faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";

export default function App() {
  const { storedCards } = useContext(StoredCardsContext);
  const { dashboard, setDashboard } = useContext(DashboardContext);

  const [cards, setCards] = React.useState([] as Card[]);

  useEffect(() => {
    setCards(getLocalStorageStoredCards());
  }, [storedCards]);

  useEffect(() => {
    if (
      !dashboard?.sections?.length &&
      !getLocalStorageDashboard()?.sections?.length
    ) {
      setLocalStorageDashboard({ sections: [] });

      const sectionId = addLocalStorageDashboardSection("General");
      if (!sectionId) return;

      const allColorFilter: MTGColor[] = [
        MTGColors.WHITE,
        MTGColors.BLUE,
        MTGColors.BLACK,
        MTGColors.RED,
        MTGColors.GREEN,
        MTGColors.GOLD,
        MTGColors.COLORLESS,
      ];

      addLocalStorageDashboardItem(sectionId, {
        title: "Cards by Mana Value",
        sortType: "cost",
        itemType: "graph",
        stacked: true,
        size: "md",
        filters: {},
      });
      addLocalStorageDashboardItem(sectionId, {
        title: "Cards by Color",
        sortType: "color",
        itemType: "graph",
        stacked: true,
        size: "md",
        filters: {},
      });
      addLocalStorageDashboardItem(sectionId, {
        title: "Cards by Mana Value",
        sortType: "cost",
        itemType: "chart",
        smallTitles: true,
        size: "sm",
        filters: { colorFilter: allColorFilter },
      });
      addLocalStorageDashboardItem(sectionId, {
        title: "Cards by Rarity",
        sortType: "rarity",
        itemType: "chart",
        smallTitles: true,
        size: "sm",
        filters: { colorFilter: allColorFilter },
      });
      addLocalStorageDashboardItem(sectionId, {
        title: "Cards by Type",
        sortType: "type",
        itemType: "chart",
        smallTitles: true,
        size: "sm",
        filters: { colorFilter: allColorFilter },
      });
      addLocalStorageDashboardItem(sectionId, {
        title: "Cards by Type",
        sortType: "type",
        itemType: "graph",
        stacked: true,
        size: "lg",
        filters: {},
      });
    } else if (
      !dashboard?.sections?.length &&
      getLocalStorageDashboard()?.sections?.length
    ) {
      setDashboard(getLocalStorageDashboard());
    }
  }, [dashboard]);

  function addSection() {
    addLocalStorageDashboardSection("New Section");
    setDashboard(getLocalStorageDashboard());
  }

  return (
    <View className="flex-1 flex">
      <View className="flex-1 flex flex-row flex-wrap gap-6 px-6 min-h-fit justify-center items-center transition-all duration-0">
        {dashboard?.sections.map((section, index) => (
          <DashboardSectionView
            cards={cards}
            sectionId={section.id}
            key={section.title + index}
          />
        ))}

        <View
          className={`${
            !dashboard?.sections?.length ? "min-h-[100dvh] -mt-12" : "my-24"
          } flex justify-center items-center`}
        >
          <Button
            text="Add Section"
            type="outlined"
            icon={faTableCellsLarge}
            onClick={() => addSection()}
          />
        </View>
      </View>

      <Footer />
    </View>
  );
}
