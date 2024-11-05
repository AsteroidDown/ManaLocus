import DashboardSectionView from "@/components/dashboard/dashboard-section";
import Button from "@/components/ui/button/button";
import { MTGColor } from "@/constants/mtg/mtg-colors";
import DashboardContext from "@/contexts/dashboard/dashboard.context";
import {
  addLocalStorageDashboardItem,
  addLocalStorageDashboardSection,
  getLocalStorageDashboard,
  setLocalStorageDashboard,
} from "@/functions/local-storage/dashboard-local-storage";
import { faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import React, { useContext } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const { dashboard, setDashboard } = useContext(DashboardContext);

  if (!dashboard?.sections) {
    setLocalStorageDashboard({ sections: [] });

    const sectionId = addLocalStorageDashboardSection("General");
    if (!sectionId) return;

    const allColorFilter: MTGColor[] = [
      "white",
      "blue",
      "black",
      "red",
      "green",
      "gold",
      "colorless",
    ];

    addLocalStorageDashboardItem(sectionId, {
      title: "Cards by Cost",
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
      title: "Cards by Cost",
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
  }

  function addSection() {
    addLocalStorageDashboardSection("New Section");
    setDashboard(getLocalStorageDashboard());
  }

  return (
    <SafeAreaView className="flex-1 bg-background-100 ">
      <ScrollView>
        <View className="flex-1 flex flex-row flex-wrap gap-6 px-6 justify-center items-center">
          {dashboard?.sections.map((section, index) => (
            <DashboardSectionView
              sectionId={section.id}
              key={section.title + index}
            />
          ))}
        </View>

        <View className="flex justify-center items-center my-24">
          <Button
            text="Add Section"
            type="outlined"
            icon={faTableCellsLarge}
            onClick={() => addSection()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}