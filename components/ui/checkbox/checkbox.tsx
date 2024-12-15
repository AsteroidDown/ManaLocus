import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Pressable, View } from "react-native";
import Text from "../text/text";

export interface CheckboxProps {
  label?: string;

  checked?: boolean;
  onChange: (checked: boolean) => void;
}

export default function Checkbox({ label, checked, onChange }: CheckboxProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Pressable
      className="flex-1 flex flex-row items-center gap-2 max-h-fit z-[-1] min-w-fit"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPress={() => onChange?.(!checked)}
    >
      <View
        className={`${
          hovered ? "bg-primary-300 border-primary-200" : ""
        } flex justify-center items-center w-6 h-6 rounded-lg bg-opacity-35 border-2 border-background-200 overflow-hidden transition-all duration-300`}
      >
        <View
          className={`${
            checked ? "w-6 h-6" : "w-0 h-0"
          } relative flex justify-center items-center bg-primary-300 rounded-full overflow-hidden transition-all duration-300`}
        >
          <FontAwesomeIcon icon={faCheck} className="text-white" />
        </View>
      </View>

      {label && (
        <Text size="md" thickness="medium">
          {label}
        </Text>
      )}
    </Pressable>
  );
}
