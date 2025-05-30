import { ActionColor } from "@/constants/ui/colors";
import { Size } from "@/constants/ui/sizes";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ViewProps } from "react-native";

export type IconProps = ViewProps & {
  icon: IconProp;
  size?: Size;
  action?: ActionColor;
};

export default function Icon({
  icon,
  size = "sm",
  action = "default",
  className,
}: IconProps) {
  const iconColor = getIconColor(action);

  return (
    <FontAwesomeIcon
      icon={icon}
      size={size !== "md" ? size : undefined}
      className={`${className} ${iconColor}`}
    />
  );
}

function getIconColor(action: ActionColor | "default") {
  return action === "default"
    ? "text-white"
    : action === "primary"
    ? "text-primary-200"
    : action === "secondary"
    ? "text-secondary-100"
    : action === "success"
    ? "text-success-100"
    : action === "danger"
    ? "text-danger-100"
    : action === "info"
    ? "text-info-100"
    : "text-warning-100";
}
