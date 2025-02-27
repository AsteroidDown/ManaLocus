import ToastContext from "@/contexts/ui/toast.context";
import { useContext } from "react";
import { View } from "react-native";
import Toast from "./toast";

export default function ToastContainer() {
  const { toasts, updateToast, removeToast } = useContext(ToastContext);

  return (
    <View className="flex gap-2 absolute bottom-4 left-4 min-w-[300px] max-w-[300px] max-h-fit z-[100]">
      {toasts.map((toast) => (
        <Toast
          {...toast}
          key={toast.startTime}
          updateProgress={(progress) =>
            updateToast(toast.startTime, { ...toast, progress })
          }
          updateStartTime={(startTime) =>
            updateToast(toast.startTime, { ...toast, startTime })
          }
          onClose={() => removeToast(toast.startTime)}
        />
      ))}
    </View>
  );
}
