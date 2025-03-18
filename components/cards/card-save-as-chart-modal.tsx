import Button from "@/components/ui/button/button";
import Divider from "@/components/ui/divider/divider";
import ColorFilter from "@/components/ui/filters/filter-types/color-filter";
import RarityFilter from "@/components/ui/filters/filter-types/rarity-filter";
import TypeFilter from "@/components/ui/filters/filter-types/type-filter";
import Modal from "@/components/ui/modal/modal";
import Text from "@/components/ui/text/text";
import { MTGColor, MTGColors } from "@/constants/mtg/mtg-colors";
import { MTGRarities, MTGRarity } from "@/constants/mtg/mtg-rarity";
import { MTGCardType, MTGCardTypes } from "@/constants/mtg/mtg-types";
import DashboardContext from "@/contexts/dashboard/dashboard.context";
import ToastContext from "@/contexts/ui/toast.context";
import {
  addLocalStorageDashboardItem,
  getLocalStorageDashboard,
  updateLocalStorageDashboardItem,
} from "@/functions/local-storage/dashboard-local-storage";
import { titleCase } from "@/functions/text-manipulation";
import { DashboardItem } from "@/models/dashboard/dashboard";
import {
  faInfoCircle,
  faRotate,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { View } from "react-native";
import { ChartType } from "../chart/chart";

export interface CardSaveAsChartModalProps {
  item?: DashboardItem;
  sectionId?: string;
  type?: ChartType;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CardSaveAsChartModal({
  item,
  sectionId,
  type = "cost",
  open,
  setOpen,
}: CardSaveAsChartModalProps) {
  const { addToast } = useContext(ToastContext);
  const { setDashboard } = useContext(DashboardContext);

  const [disabled, setDisabled] = React.useState(false);
  const [error, setError] = React.useState(false);

  const [sortType, setSortType] = React.useState(
    (item ? item.sortType : type) as ChartType
  );

  const [colorFilter, setColorFilter] = React.useState(
    item?.filters.colorFilter as MTGColor[] | undefined
  );
  const [typeFilter, setTypeFilter] = React.useState(
    item?.filters.typeFilter as MTGCardType[] | undefined
  );
  const [rarityFilter, setRarityFilter] = React.useState(
    item?.filters.rarityFilter as MTGRarity[] | undefined
  );

  function createChart() {
    setDisabled(true);

    if (item) {
      updateLocalStorageDashboardItem(item.id, sectionId ?? "unsorted", {
        sortType,
        filters: {
          colorFilter,
          typeFilter: sortType !== "type" ? typeFilter : undefined,
          rarityFilter: sortType !== "rarity" ? rarityFilter : undefined,
        },
      });
    } else {
      addLocalStorageDashboardItem(sectionId ?? "unsorted", {
        title: generateTitle(sortType, colorFilter, rarityFilter, typeFilter),
        sortType,
        itemType: "chart",
        stacked: true,
        size: "lg",
        smallTitles: true,
        filters: {
          colorFilter,
          typeFilter: sortType !== "type" ? typeFilter : undefined,
          rarityFilter: sortType !== "rarity" ? rarityFilter : undefined,
        },
      });
    }

    setDashboard(getLocalStorageDashboard());

    setDisabled(false);

    if (item) setOpen(false);
    addToast({
      action: "success",
      title: `${item ? "Chart Updated" : "Chart Created"}!`,
      subtitle: `${
        item ? "Your chart has been updated" : "Your chart has been created"
      }`,
    });
  }

  return (
    <Modal open={open} setOpen={setOpen}>
      <View className="flex gap-2 max-w-[400px]">
        <View className="flex flex-row gap-4">
          <FontAwesomeIcon icon={faTable} size="2xl" className="color-white" />

          <Text size="2xl" weight="bold">
            {item ? "Update Chart" : "Save As Chart"}
          </Text>
        </View>

        <View className="flex gap-4">
          <Text>
            {item
              ? "Update the filters for " + item.title
              : "Add a Chart to the dashboard with the following filters:"}
          </Text>

          <View className="flex gap-2 max-w-96">
            <Text size="md" weight="bold">
              Sort Type
            </Text>

            <Divider thick />

            <View className="flex flex-row gap-2 max-w-96">
              <Button
                rounded
                text="Cost"
                className="flex-1"
                type={sortType !== "cost" ? "outlined" : "default"}
                onClick={() => setSortType("cost")}
              ></Button>

              <Button
                rounded
                text="Rarity"
                className="flex-1"
                type={sortType !== "rarity" ? "outlined" : "default"}
                onClick={() => setSortType("rarity")}
              ></Button>

              <Button
                rounded
                text="Type"
                className="flex-1"
                type={sortType !== "type" ? "outlined" : "default"}
                onClick={() => setSortType("type")}
              ></Button>
            </View>
          </View>

          <View className="flex gap-2 max-w-96">
            <Text size="md" weight="bold">
              Colors to Include
            </Text>

            <Divider thick />

            <ColorFilter
              flat
              excludeMono
              colorFilters={colorFilter}
              setColorFilters={setColorFilter}
            />
          </View>

          <View className="flex gap-2 max-w-96">
            <Text size="md" weight="bold">
              Types to Filter By
            </Text>

            <Divider thick />

            <TypeFilter
              flat
              typeFilters={typeFilter}
              disabled={sortType === "type"}
              setTypeFilters={setTypeFilter}
            />
          </View>

          <View className="flex gap-2 max-w-96">
            <Text size="md" weight="bold">
              Rarities to Filter By
            </Text>

            <Divider thick />

            <RarityFilter
              flat
              rarityFilters={rarityFilter}
              disabled={sortType === "rarity"}
              setRarityFilters={setRarityFilter}
            />
          </View>
        </View>

        <Button
          rounded
          type="outlined"
          className="mt-4"
          disabled={disabled || colorFilter?.length === 0}
          action={error ? "danger" : "primary"}
          icon={disabled ? faRotate : error ? faInfoCircle : faTable}
          text={
            disabled
              ? item
                ? "Updating Chart..."
                : "Creating Chart..."
              : error
              ? "Error Creating Chart!"
              : item
              ? "Update Chart"
              : "Create Chart"
          }
          onClick={async () => createChart()}
        />
      </View>
    </Modal>
  );
}

function generateTitle(
  type: ChartType,
  colorFilter?: MTGColor[],
  rarityFilter?: MTGRarity[],
  typeFilter?: MTGCardType[]
) {
  let title = "";

  if (colorFilter?.length && colorFilter.length !== 7) {
    if (colorFilter.includes(MTGColors.WHITE)) title += "White ";
    if (colorFilter.includes(MTGColors.BLUE)) title += "Blue ";
    if (colorFilter.includes(MTGColors.BLACK)) title += "Black ";
    if (colorFilter.includes(MTGColors.RED)) title += "Red ";
    if (colorFilter.includes(MTGColors.GREEN)) title += "Green ";
    if (colorFilter.includes(MTGColors.GOLD)) title += "Gold ";
    if (colorFilter.includes(MTGColors.COLORLESS)) title += "Colorless ";
  }

  if (rarityFilter?.length) {
    const multiple = rarityFilter.length > 1;

    if (rarityFilter.includes(MTGRarities.COMMON)) {
      title += "Common" + (multiple ? ", " : " ");
    }
    if (rarityFilter.includes(MTGRarities.UNCOMMON)) {
      title += "Uncommon" + (multiple ? ", " : " ");
    }
    if (rarityFilter.includes(MTGRarities.RARE)) {
      title += "Rare" + (multiple ? ", " : " ");
    }
    if (rarityFilter.includes(MTGRarities.MYTHIC)) {
      title += "Mythic" + (multiple ? ", " : " ");
    }
  }

  if (typeFilter?.length) {
    const multiple = typeFilter.length > 1;

    if (typeFilter.includes(MTGCardTypes.CREATURE)) {
      title += "Creature" + (multiple ? ", " : " ");
    }
    if (typeFilter.includes(MTGCardTypes.INSTANT)) {
      title += "Instant" + (multiple ? ", " : " ");
    }
    if (typeFilter.includes(MTGCardTypes.SORCERY)) {
      title += "Sorcery" + (multiple ? ", " : " ");
    }
    if (typeFilter.includes(MTGCardTypes.ARTIFACT)) {
      title += "Artifact" + (multiple ? ", " : " ");
    }
    if (typeFilter.includes(MTGCardTypes.ENCHANTMENT)) {
      title += "Enchantment" + (multiple ? ", " : " ");
    }
    if (typeFilter.includes(MTGCardTypes.LAND)) {
      title += "Land" + (multiple ? ", " : " ");
    }
    if (typeFilter.includes(MTGCardTypes.PLANESWALKER)) {
      title += "Planeswalker" + (multiple ? ", " : " ");
    }
    if (typeFilter.includes(MTGCardTypes.BATTLE)) {
      title += "Battle ";
    }
  }

  title += "Cards by " + (type === "cost" ? "Mana Value" : titleCase(type));

  return title;
}
