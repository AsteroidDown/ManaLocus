import Chip from "@/components/ui/chip/chip";
import { SortType, SortTypes } from "@/constants/sorting";
import { ActionColor } from "@/constants/ui/colors";
import {
  faDownLong,
  faUpLong,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { View, ViewProps } from "react-native";
import { getFilterTextColor } from "./filter";

export type SortingFilterProps = ViewProps & {
  title?: string;
  startIcon?: IconDefinition;
  endIcon?: IconDefinition;
  action?: ActionColor;
  disabled?: boolean;

  reset?: boolean;
  sortDirection: SortType;
  setSortDirection: React.Dispatch<React.SetStateAction<SortType>>;
};

export default function SortingFilter({
  title,
  startIcon,
  endIcon,
  action = "primary",
  disabled = false,
  reset,
  sortDirection,
  setSortDirection,
  className,
  style,
}: SortingFilterProps) {
  const textColor = getFilterTextColor(action, disabled);

  function changeDirection() {
    if (sortDirection === SortTypes.ASC) setSortDirection("DESC");
    else if (sortDirection === SortTypes.DESC) setSortDirection(null);
    else setSortDirection(SortTypes.ASC);
  }

  useEffect(() => setSortDirection(null), [reset]);

  return (
    <Chip
      type="outlined"
      text={title}
      startIcon={startIcon}
      endIcon={endIcon}
      style={style}
      action={action}
      className={className}
      onClick={() => changeDirection()}
    >
      <View
        className={`overflow-hidden transition-all duration-300 ${
          sortDirection ? "ml-0 max-w-[100px]" : "-ml-2 max-w-[0px]"
        }`}
      >
        <View
          className={`text-dark-100 rounded-full px-[7px] py-[3px] ${textColor}`}
        >
          <FontAwesomeIcon
            size="sm"
            icon={sortDirection === SortTypes.ASC ? faUpLong : faDownLong}
            className={`${textColor} ${
              sortDirection === SortTypes.ASC ? "rotate-0" : "rotate-[360deg]"
            } transition-all`}
          />
        </View>
      </View>
    </Chip>
  );
}
