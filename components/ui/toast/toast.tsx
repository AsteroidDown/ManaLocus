import { ActionColor } from "@/constants/ui/colors";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faInfoCircle, faX } from "@fortawesome/free-solid-svg-icons";
import { ReactNode, useEffect, useState } from "react";
import { View } from "react-native";
import Button from "../button/button";
import Icon from "../icon/icon";
import Text from "../text/text";

export interface ToastProps {
  title: string;
  subtitle?: string;

  icon?: IconProp;
  action?: ActionColor;
  content?: ReactNode;

  startTime: number;
  duration?: number;
  progress?: number;

  updateProgress: (progress: number) => void;
  updateStartTime: (startTime: number) => void;
  onClose: () => void;
}

export default function Toast({
  title,
  subtitle,
  icon,
  action = "primary",
  content,
  startTime,
  duration = 3000,
  progress = 0,
  updateStartTime,
  updateProgress,
  onClose,
}: ToastProps) {
  const [hovered, setHovered] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);

  const [slideIn, setSlideIn] = useState(progress === 0);
  const [fadingOut, setFadingOut] = useState(false);

  const textColor = getToastTextColor(action);
  const barColor = getToastBarColor(action);

  useEffect(() => {
    if (hovered || fadingOut) return;
    if (slideIn) setSlideIn(false);
    if (progress >= 100) fadeOut();

    const now = Date.now();
    const elapsed = now - startTime;

    const delayDebounceFn = setTimeout(() => {
      if (hovered) return;
      const newProgress = (elapsed / duration) * 100;
      updateProgress(newProgress);
    }, 10);

    return () => clearTimeout(delayDebounceFn);
  }, [progress, hovered]);

  function hoverIn() {
    setHoverTime(Date.now());
    setHovered(true);
  }

  function hoverOut() {
    const out = Date.now();
    const diff = hoverTime - startTime;

    updateStartTime(out - diff);
    setHovered(false);
  }

  function fadeOut() {
    setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => onClose?.(), 300);
    }, 150);
  }

  return (
    <View
      className={`${slideIn ? "-mb-[100%] mt-[75%]" : ""} ${
        fadingOut || slideIn ? "opacity-0" : "opacity-100"
      } flex-1 flex bg-dark-100 rounded-xl overflow-hidden shadow-lg border-background-100 border transition-all duration-300 ease-linear`}
      onPointerEnter={hoverIn}
      onPointerLeave={hoverOut}
    >
      <View className="flex flex-row justify-between items-center gap-2 px-4 py-2">
        <View className="flex-1 flex flex-row items-center gap-3">
          <Icon
            icon={icon ?? faInfoCircle}
            className={`${textColor} w-6 h-6`}
          />

          <View className="flex-1 flex">
            <Text className="text-sm font-bold">{title}</Text>

            {subtitle && (
              <Text className="text-xs text-dark-600">{subtitle}</Text>
            )}
          </View>
        </View>

        <Button
          rounded
          type="clear"
          icon={faX}
          size="sm"
          action="default"
          className="self-start !p-0"
          onClick={fadeOut}
        />
      </View>

      {content && <View className="flex-1 px-4 pb-3">{content}</View>}

      <View className="self-end w-full h-1 bg-dark-200">
        <View
          className={`${barColor} h-1 transition-all ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  );
}

function getToastTextColor(action: ActionColor) {
  return action === "default"
    ? "!text-white"
    : action === "success"
    ? "!text-success-300"
    : action === "danger"
    ? "!text-danger-300"
    : action === "info"
    ? "!text-info-300"
    : action === "warning"
    ? "!text-warning-300"
    : "!text-primary-300";
}

function getToastBarColor(action: ActionColor) {
  return action === "default"
    ? "bg-dark-300"
    : action === "success"
    ? "bg-success-300"
    : action === "danger"
    ? "bg-danger-300"
    : action === "info"
    ? "bg-info-300"
    : action === "warning"
    ? "bg-warning-300"
    : "bg-primary-300";
}
