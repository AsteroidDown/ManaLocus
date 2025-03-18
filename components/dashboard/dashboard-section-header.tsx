import Button from "@/components/ui/button/button";
import Text from "@/components/ui/text/text";
import DashboardContext from "@/contexts/dashboard/dashboard.context";
import {
  getLocalStorageDashboard,
  updateLocalStorageDashboardSection,
} from "@/functions/local-storage/dashboard-local-storage";
import { DashboardSection } from "@/models/dashboard/dashboard";
import {
  faCheck,
  faEllipsisV,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext } from "react";
import { TextInput, View, ViewProps } from "react-native";
import DashboardSectionOptionsMenu from "./dashboard-section-options-menu";

export type DashboardSectionHeaderProps = ViewProps & {
  section: DashboardSection;

  readonly?: boolean;
};

export default function DashboardSectionHeader({
  section,

  readonly = false,
}: DashboardSectionHeaderProps) {
  const { setDashboard } = useContext(DashboardContext);

  const [addItemOpen, setAddItemOpen] = React.useState(false);

  const [sectionTitleHovered, setSectionTitleHovered] = React.useState(false);

  const [sectionTitle, setSectionTitle] = React.useState("");
  const [editingSection, setEditingSection] = React.useState(false);

  function updateSectionTitle() {
    if (!section || !sectionTitle) {
      setEditingSection(false);
      return;
    }

    updateLocalStorageDashboardSection(section.id, sectionTitle);
    setDashboard(getLocalStorageDashboard());
    setEditingSection(false);
  }

  return (
    <View
      className="flex flex-row gap-2 justify-between items-center py-4 w-full bg-background-100 bg-opacity-60 sticky top-0"
      onPointerEnter={() => setSectionTitleHovered(true)}
      onPointerLeave={() => setSectionTitleHovered(false)}
    >
      <View className="flex flex-row gap-2 items-center">
        {!editingSection && (
          <Text size="2xl" weight="bold" className="py-1 pr-auto">
            {section.title}
          </Text>
        )}

        {editingSection && (
          <TextInput
            placeholderTextColor="#8b8b8b"
            className="color-white outline-none text-2xl font-bold"
            value={sectionTitle}
            placeholder={section.title}
            onChangeText={(text) => setSectionTitle(text)}
            onKeyPress={(event) =>
              (event as any)?.code === "Enter" ? updateSectionTitle() : null
            }
          />
        )}

        {!readonly && (
          <Button
            rounded
            type="clear"
            action="default"
            icon={editingSection ? faCheck : faPencil}
            className={`${
              editingSection || sectionTitleHovered
                ? "opacity-100"
                : "opacity-0"
            } transition-all duration-500`}
            onClick={() =>
              editingSection
                ? updateSectionTitle()
                : setEditingSection(!editingSection)
            }
          />
        )}
      </View>

      {!readonly && (
        <View className="flex gap-2 items-center max-w-10 max-h-10">
          <Button
            rounded
            type="clear"
            action="default"
            icon={faEllipsisV}
            onClick={() => setAddItemOpen(true)}
          />

          <DashboardSectionOptionsMenu
            xOffset={-120}
            section={section}
            addItemOpen={addItemOpen}
            setAddItemOpen={setAddItemOpen}
          />
        </View>
      )}
    </View>
  );
}
