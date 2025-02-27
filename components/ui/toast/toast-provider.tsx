import ToastContext from "@/contexts/ui/toast.context";
import { Toast, ToastOptions } from "@/models/toast/toast";
import { useState } from "react";
import ToastContainer from "./toast-container";

export default function ToastProvider({ children }: { children: any }) {
  const [toasts, setToasts] = useState([] as Toast[]);

  function addToast(options: ToastOptions) {
    setToasts([...toasts, { ...options, startTime: Date.now() }]);
  }

  function removeToast(startTime: number) {
    setToasts(toasts.filter((toast) => toast.startTime !== startTime));
  }

  function updateToast(startTime: number, newToast: Toast) {
    setToasts((toasts) =>
      toasts.map((toast) =>
        toast.startTime === startTime ? { ...newToast } : toast
      )
    );
  }
  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        updateToast,
        setToasts,
      }}
    >
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}
