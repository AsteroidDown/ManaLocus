import Box from "@/components/ui/box/box";
import Button from "@/components/ui/button/button";
import DashboardContext from "@/contexts/dashboard/dashboard.context";
import {
  getLocalStorageDashboard,
  moveDownLocalStorageDashboardSection,
  moveUpLocalStorageDashboardSection,
  removeLocalStorageDashboardSection,
} from "@/functions/local-storage/dashboard-local-storage";
import { DashboardSection } from "@/models/dashboard/dashboard";
import {
  faChartSimple,
  faDownLong,
  faTable,
  faTrash,
  faUpLong,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext } from "react";
import { ViewProps } from "react-native";
import CardSaveAsChartModal from "../cards/card-save-as-chart-modal";
import CardSaveAsGraphModal from "../cards/card-save-as-graph-modal";
import Dropdown from "../ui/dropdown/dropdown";
import SimpleModal from "../ui/modal/simple-modal";

export type DashboardSectionOptionsMenuProps = ViewProps & {
  xOffset?: number;
  section: DashboardSection;
  addItemOpen: boolean;
  setAddItemOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addOnly?: boolean;
};

export default function DashboardSectionOptionsMenu({
  xOffset,
  section,
  addItemOpen,
  setAddItemOpen,
  addOnly = false,
}: DashboardSectionOptionsMenuProps) {
  const { setDashboard } = useContext(DashboardContext);

  const [addGraphOpen, setAddGraphOpen] = React.useState(false);
  const [addChartOpen, setAddChartOpen] = React.useState(false);
  const [removeSectionOpen, setRemoveSectionOpen] = React.useState(false);

  function moveSectionUp() {
    moveUpLocalStorageDashboardSection(section.id);
    setDashboard(getLocalStorageDashboard());
  }

  function moveSectionDown() {
    moveDownLocalStorageDashboardSection(section.id);
    setDashboard(getLocalStorageDashboard());
  }

  function removeSection(sectionId: string) {
    removeLocalStorageDashboardSection(sectionId);
    setDashboard(getLocalStorageDashboard());
  }

  return (
    <>
      <Dropdown expanded={addItemOpen} setExpanded={setAddItemOpen}>
        <Box className="flex justify-start items-start !p-0 border-2 border-primary-300 !bg-background-100 !bg-opacity-95 overflow-hidden">
          <Button
            start
            square
            type="clear"
            text="Add Graph"
            className="w-full"
            icon={faChartSimple}
            onClick={() => {
              setAddGraphOpen(true);
              setAddItemOpen(false);
            }}
          />

          <Button
            start
            square
            type="clear"
            text="Add Chart"
            className="w-full"
            icon={faTable}
            onClick={() => {
              setAddChartOpen(true);
              setAddItemOpen(false);
            }}
          />

          {!addOnly && (
            <>
              <Button
                start
                square
                type="clear"
                text="Move Up"
                className="w-full"
                icon={faUpLong}
                onClick={() => moveSectionUp()}
              ></Button>

              <Button
                start
                square
                type="clear"
                text="Move Down"
                className="w-full"
                icon={faDownLong}
                onClick={() => moveSectionDown()}
              ></Button>

              <Button
                start
                square
                type="clear"
                text="Remove"
                className="w-full"
                icon={faTrash}
                onClick={() => {
                  setRemoveSectionOpen(true);
                  setAddItemOpen(false);
                }}
              />
            </>
          )}
        </Box>
      </Dropdown>

      <CardSaveAsGraphModal
        sectionId={section.id}
        open={addGraphOpen}
        setOpen={setAddGraphOpen}
      />

      <CardSaveAsChartModal
        sectionId={section.id}
        open={addChartOpen}
        setOpen={setAddChartOpen}
      />

      <SimpleModal
        title={"Remove " + section.title + "?"}
        description="This action can't be undone. Are you sure you want to continue?"
        confirmText="Remove Section"
        confirmActionColor="danger"
        open={removeSectionOpen}
        setOpen={setRemoveSectionOpen}
        confirmAction={() => removeSection(section.id)}
      ></SimpleModal>
    </>
  );
}
