import Chip from "@/components/ui/chip/chip";
import Dropdown from "@/components/ui/dropdown/dropdown";
import Text from "@/components/ui/text/text";
import { ActionColor } from "@/constants/ui/colors";
import React from "react";
import { View, ViewProps } from "react-native";

export type FilterOptionProps = ViewProps & {
  title: string;

  applied: boolean;
  applyFilter: React.Dispatch<React.SetStateAction<boolean>>;

  action?: ActionColor;
};

export type FilterProps = ViewProps & {
  title: string;
  options: FilterOptionProps[];
  action?: ActionColor;
  disabled?: boolean;
};

export default function Filter({
  title,
  options,
  action = "primary",
  disabled = false,
  className,
  style,
}: FilterProps) {
  const [expanded, setExpanded] = React.useState(false);

  const appliedFilterCount = options?.reduce(
    (acc, option) => (option.applied ? acc + 1 : acc),
    0
  );
  const textColor = getFilterTextColor(action, disabled);

  return (
    <View>
      <Chip
        type="outlined"
        text={title}
        style={style}
        action={action}
        className={className}
        onClick={() => setExpanded(!expanded)}
      >
        <View
          className={`overflow-hidden transition-all duration-300 ${
            appliedFilterCount > 0 ? "ml-0 max-w-[100px]" : "-ml-2 max-w-[0px]"
          }`}
        >
          <Text
            weight="semi"
            className={`!text-dark-100 rounded-full px-[7px] py-[3px] ${textColor}`}
          >
            {appliedFilterCount}
          </Text>
        </View>
      </Chip>

      <Dropdown
        expanded={expanded}
        setExpanded={setExpanded}
        className={`!max-w-[360px] px-4 py-2 border-2 border-primary-300 bg-dark-200 rounded-2xl shadow-lg`}
      >
        <View className="flex flex-row flex-wrap gap-2">
          {options.map((option, index) => (
            <Chip
              text={option.title}
              action={option.action}
              className={className}
              key={option.title + index}
              type={option.applied ? "default" : "outlined"}
              onClick={() => option.applyFilter?.(!option.applied)}
            />
          ))}
        </View>
      </Dropdown>
    </View>
  );
}

export function getFilterTextColor(action: ActionColor, disabled: boolean) {
  if (disabled) return "text-dark-600";

  return `${
    action === "primary"
      ? "bg-primary-200"
      : action === "secondary"
      ? "bg-secondary-100"
      : action === "success"
      ? "bg-success-100"
      : action === "danger"
      ? "bg-danger-100"
      : action === "info"
      ? "bg-info-100"
      : "bg-warning-100"
  }`;
}
