import {
  faInfoCircle,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { View, ViewProps } from "react-native";
import Box from "../box/box";
import Text from "../text/text";

export type PlaceholderProps = ViewProps & {
  title: string;
  subtitle?: string;
  icon?: IconDefinition;
};

export default function Placeholder({
  title,
  subtitle,
  icon,
  className,
  children,
}: PlaceholderProps) {
  return (
    <Box
      className={`${className} flex gap-1 justify-center items-center py-6 w-full h-full !bg-background-100 border-2 border-background-200`}
    >
      <View className="border-2 border-white p-2 mb-3 rounded-full">
        <FontAwesomeIcon
          className="text-white"
          size="4x"
          icon={icon ?? faInfoCircle}
        />
      </View>

      <Text size="xl" weight="bold">
        {title}
      </Text>

      <Text>{subtitle}</Text>

      <View className="mt-4">{children}</View>
    </Box>
  );
}
