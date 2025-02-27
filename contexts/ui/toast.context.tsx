import { Toast, ToastOptions } from "@/models/toast/toast";
import { createContext } from "react";

const ToastContext = createContext({
  toasts: [] as Toast[],
  addToast: (options: ToastOptions) => {},
  removeToast: (index: number) => {},
  updateToast: (index: number, toast: Toast) => {},
  setToasts: (value: Toast[]) => {},
});

export default ToastContext;
