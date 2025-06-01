import Text from "@/components/ui/text/text";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ReactNode } from "react";
import { useWindowDimensions, View, ViewProps } from "react-native";
import Divider from "../divider/divider";
import Icon from "../icon/icon";

export type BoxHeaderProps = ViewProps & {
  title?: string;
  subtitle?: string | ReactNode;

  start?: ReactNode;
  startIcon?: IconProp;
  titleEnd?: ReactNode;
  end?: ReactNode;

  divider?: boolean;
};

export default function BoxHeader({
  title,
  subtitle,
  start,
  startIcon,
  titleEnd,
  end,
  className,
  divider = false,
}: BoxHeaderProps) {
  const width = useWindowDimensions().width;

  return (
    <View className="flex-1 -mx-6 max-h-fit">
      <View
        className={`flex flex-row flex-wrap justify-between items-center gap-2 px-6 pb-4 ${className}`}
      >
        <View
          className={`flex-1 flex flex-row items-center gap-4 min-w-[100px] max-w-fit`}
        >
          {start}

          {startIcon && (
            <Icon icon={startIcon} size={width > 600 ? "lg" : undefined} />
          )}

          <View className="flex-1 flex">
            {!!title && (
              <Text size={width > 600 ? "xl" : "lg"} weight="bold">
                {title}
              </Text>
            )}

            {!!subtitle && <Text className="!text-gray-200">{subtitle}</Text>}
          </View>

          {titleEnd}
        </View>

        {end}
      </View>

      {divider && <Divider thick />}
    </View>
  );
}
