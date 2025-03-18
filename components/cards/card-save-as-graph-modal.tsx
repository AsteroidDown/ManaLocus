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
import { CardFilterSortType } from "@/models/sorted-cards/sorted-cards";
import {
  faChartSimple,
  faInfoCircle,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { View } from "react-native";

export interface CardSaveAsGraphModalProps {
  item?: DashboardItem;
  sectionId?: string;
  type?: CardFilterSortType;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CardSaveAsGraphModal({
  item,
  sectionId,
  type = "cost",
  open,
  setOpen,
}: CardSaveAsGraphModalProps) {
  const { addToast } = useContext(ToastContext);
  const { setDashboard } = useContext(DashboardContext);

  const [disabled, setDisabled] = React.useState(false);
  const [error, setError] = React.useState(false);

  const [sortType, setSortType] = React.useState(
    (item ? item.sortType : type) as CardFilterSortType
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

  function createGraph() {
    setDisabled(true);

    if (item) {
      updateLocalStorageDashboardItem(item.id, sectionId ?? "unsorted", {
        sortType: sortType,
        filters: {
          colorFilter,
          typeFilter,
          rarityFilter,
        },
      });
    } else {
      addLocalStorageDashboardItem(sectionId ?? "unsorted", {
        title: generateGraphTitle(
          sortType,
          colorFilter,
          typeFilter,
          rarityFilter
        ),
        itemType: "graph",
        sortType: sortType,
        stacked: true,
        size: "lg",
        filters: {
          colorFilter,
          typeFilter,
          rarityFilter,
        },
      });
    }

    setDashboard(getLocalStorageDashboard());

    setDisabled(false);

    if (item) setOpen(false);

    addToast({
      action: "success",
      title: `${item ? "Graph Updated" : "Graph Created"}!`,
      subtitle: `${
        item ? "Your graph has been updated" : "Your graph has been created"
      }`,
    });
  }

  return (
    <Modal open={open} setOpen={setOpen}>
      <View className="flex gap-2 max-w-[400px]">
        <View className="flex flex-row gap-4">
          <FontAwesomeIcon
            icon={faChartSimple}
            size="2xl"
            className="color-white"
          />
          <Text size="2xl" weight="bold">
            {item ? "Update Graph" : "Save As Graph"}
          </Text>
        </View>

        <View className="flex gap-4">
          <Text>
            {item
              ? "Update the filters for " + item.title
              : "Add a graph to the dashboard with the following filters:"}
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
                text="Color"
                className="flex-1"
                type={sortType !== "color" ? "outlined" : "default"}
                onClick={() => setSortType("color")}
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
              Color
            </Text>

            <Divider thick />

            <ColorFilter
              flat
              colorFilters={colorFilter}
              setColorFilters={setColorFilter}
            />
          </View>

          <View className="flex gap-2 max-w-96">
            <Text size="md" weight="bold">
              Type
            </Text>

            <Divider thick />

            <TypeFilter
              flat
              typeFilters={typeFilter}
              setTypeFilters={setTypeFilter}
            />
          </View>

          <View className="flex gap-2 max-w-96">
            <Text size="md" weight="bold">
              Rarity
            </Text>

            <Divider thick />

            <RarityFilter
              flat
              rarityFilters={rarityFilter}
              setRarityFilters={setRarityFilter}
            />
          </View>
        </View>

        <Button
          rounded
          type="outlined"
          className="mt-4"
          disabled={disabled}
          action={error ? "danger" : "primary"}
          icon={disabled ? faRotate : error ? faInfoCircle : faChartSimple}
          text={
            disabled
              ? item
                ? "Updating Graph..."
                : "Creating Graph..."
              : error
              ? "Error Creating Graph!"
              : item
              ? "Update Graph"
              : "Create Graph"
          }
          onClick={async () => createGraph()}
        />
      </View>
    </Modal>
  );
}

export function generateGraphTitle(
  type: CardFilterSortType,
  colorFilter?: MTGColor[],
  typeFilter?: MTGCardType[],
  rarityFilter?: MTGRarity[]
) {
  let title = "";

  if (colorFilter?.length) {
    if (colorFilter.includes("mono")) {
      title += "Mono " + (colorFilter.length === 1 ? "Colored " : "");
    }
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
    const typeFilterLowerCase = typeFilter.map((type) => type.toLowerCase());

    if (typeFilterLowerCase.includes(MTGCardTypes.CREATURE)) {
      title += "Creature" + (multiple ? ", " : " ");
    }
    if (typeFilter.includes(MTGCardTypes.INSTANT)) {
      title += "Instant" + (multiple ? ", " : " ");
    }
    if (typeFilterLowerCase.includes(MTGCardTypes.SORCERY)) {
      title += "Sorcery" + (multiple ? ", " : " ");
    }
    if (typeFilterLowerCase.includes(MTGCardTypes.ARTIFACT)) {
      title += "Artifact" + (multiple ? ", " : " ");
    }
    if (typeFilterLowerCase.includes(MTGCardTypes.ENCHANTMENT)) {
      title += "Enchantment" + (multiple ? ", " : " ");
    }
    if (typeFilterLowerCase.includes(MTGCardTypes.LAND)) {
      title += "Land" + (multiple ? ", " : " ");
    }
    if (typeFilterLowerCase.includes(MTGCardTypes.PLANESWALKER)) {
      title += "Planeswalker" + (multiple ? ", " : " ");
    }
    if (typeFilterLowerCase.includes(MTGCardTypes.BATTLE)) {
      title += "Battle ";
    }
  }

  title += "Cards by " + (type === "cost" ? "Mana Value" : titleCase(type));

  return title;
}
