import {
  faInfoCircle,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { View, ViewProps } from "react-native";
import Box from "../box/box";
import Icon from "../icon/icon";
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
      className={`${className} flex gap-1 justify-center items-center py-6 w-full h-full min-h-fit max-h-fit !bg-background-100 border-2 border-background-200`}
    >
      <Icon
        icon={icon ?? faInfoCircle}
        className="!text-6xl !text-dark-500 border-2 border-background-300 p-6 mb-3 rounded-full"
      />

      <Text size="lg" weight="medium">
        {title}
      </Text>

      <Text>{subtitle}</Text>

      <View className="mt-4">{children}</View>
    </Box>
  );
}
