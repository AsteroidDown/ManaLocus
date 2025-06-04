import { ActionColor } from "@/constants/ui/colors";
import { Size } from "@/constants/ui/sizes";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { IconDefinition } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ViewProps } from "react-native";

export type IconProps = ViewProps & {
  icon: IconProp | IconDefinition;
  size?: Size;
  action?: ActionColor;
  onClick?: () => void;
};

export default function Icon({
  icon,
  size = "sm",
  action = "default",
  onClick,
  className,
}: IconProps) {
  const iconColor = getIconColor(action);

  return (
    <FontAwesomeIcon
      icon={icon as any}
      size={size !== "md" ? size : undefined}
      className={`${className} ${iconColor} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
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
