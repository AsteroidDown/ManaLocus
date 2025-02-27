import { ActionColor } from "@/constants/ui/colors";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ReactNode } from "react";

export interface Toast {
  title: string;
  subtitle?: string;

  icon?: IconProp;
  action?: ActionColor;

  content?: ReactNode;

  startTime: number;
  duration?: number;
  progress?: number;
}

export interface ToastOptions {
  title: string;
  subtitle?: string;

  icon?: IconProp;
  action?: ActionColor;

  duration?: number;
  progress?: number;
  content?: ReactNode;
}
