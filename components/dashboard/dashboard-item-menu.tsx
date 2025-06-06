import Box from "@/components/ui/box/box";
import Button from "@/components/ui/button/button";
import DashboardContext from "@/contexts/dashboard/dashboard.context";
import {
  getLocalStorageDashboard,
  moveDownLocalStorageDashboardItem,
  moveUpLocalStorageDashboardItem,
  removeLocalStorageDashboardItem,
  updateLocalStorageDashboardItem,
} from "@/functions/local-storage/dashboard-local-storage";
import { DashboardItem, DashboardItemSize } from "@/models/dashboard/dashboard";
import {
  faDownLong,
  faEllipsisV,
  faExpand,
  faMaximize,
  faMinimize,
  faPencil,
  faUpLong,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext } from "react";
import CardSaveAsChartModal from "../cards/card-save-as-chart-modal";
import CardSaveAsGraphModal from "../cards/card-save-as-graph-modal";
import Dropdown from "../ui/dropdown/dropdown";

export interface DashboardItemMenu {
  item: DashboardItem;
  sectionId: string;
  xOffset?: number;
}

export default function DashboardItemMenu({
  item,
  sectionId,
  xOffset = 0,
}: DashboardItemMenu) {
  const { setDashboard } = useContext(DashboardContext);

  const [expanded, setExpanded] = React.useState(false);

  const [editGraphFiltersOpen, setEditGraphFiltersOpen] = React.useState(false);
  const [editChartFiltersOpen, setEditChartFiltersOpen] = React.useState(false);

  function editItemFilters() {
    if (!item || !sectionId) return;

    if (item.itemType === "graph") setEditGraphFiltersOpen(true);
    else if (item.itemType === "chart") setEditChartFiltersOpen(true);

    setExpanded(false);
  }

  function moveItemUp() {
    if (!item || !sectionId) return;

    moveUpLocalStorageDashboardItem(item.id, sectionId);
    setDashboard(getLocalStorageDashboard());
  }

  function moveItemDown() {
    if (!item || !sectionId) return;

    moveDownLocalStorageDashboardItem(item.id, sectionId);
    setDashboard(getLocalStorageDashboard());
  }

  function setItemSize(size: DashboardItemSize) {
    if (!item || !sectionId) return;

    updateLocalStorageDashboardItem(item.id, sectionId, { size });
    setDashboard(getLocalStorageDashboard());
    setExpanded(false);
  }

  function removeItem() {
    if (!item || !sectionId) return;

    removeLocalStorageDashboardItem(item.id, sectionId);
    setDashboard(getLocalStorageDashboard());
  }

  return (
    <>
      <Button
        rounded
        icon={faEllipsisV}
        type="clear"
        action="default"
        onClick={() => setExpanded(!expanded)}
      />

      <Dropdown expanded={expanded} setExpanded={setExpanded}>
        <Box className="flex justify-start items-start !p-0 border-2 border-primary-300 !bg-background-100 !bg-opacity-95 overflow-hidden">
          <Button
            start
            square
            type="clear"
            text="Update"
            className="w-full"
            icon={faPencil}
            onClick={editItemFilters}
          />

          <Button
            start
            square
            type="clear"
            text="Move Up"
            className="w-full"
            icon={faUpLong}
            onClick={moveItemUp}
          />

          <Button
            start
            square
            type="clear"
            text="Move Down"
            className="w-full"
            icon={faDownLong}
            onClick={moveItemDown}
          />

          {item.size !== "sm" && (
            <Button
              start
              square
              type="clear"
              text="Small"
              className="w-full"
              icon={faMinimize}
              onClick={() => setItemSize("sm")}
            />
          )}

          {item.size !== "md" && (
            <Button
              start
              square
              type="clear"
              text="Medium"
              className="w-full"
              icon={faExpand}
              onClick={() => setItemSize("md")}
            />
          )}

          {item.size !== "lg" && (
            <Button
              start
              square
              type="clear"
              text="Large"
              className="w-full"
              icon={faMaximize}
              onClick={() => setItemSize("lg")}
            />
          )}

          <Button
            start
            square
            type="clear"
            text="Delete"
            className="w-full"
            icon={faX}
            onClick={removeItem}
          />
        </Box>
      </Dropdown>

      <CardSaveAsGraphModal
        item={item}
        sectionId={sectionId}
        open={editGraphFiltersOpen}
        setOpen={setEditGraphFiltersOpen}
      />

      <CardSaveAsChartModal
        item={item}
        sectionId={sectionId}
        open={editChartFiltersOpen}
        setOpen={setEditChartFiltersOpen}
      />
    </>
  );
}
