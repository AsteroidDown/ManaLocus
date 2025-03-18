import Button from "@/components/ui/button/button";
import Modal from "@/components/ui/modal/modal";
import Text from "@/components/ui/text/text";
import { ActionColor } from "@/constants/ui/colors";
import React from "react";
import { View } from "react-native";

export interface SimpleModalProps {
  title: string;
  subtitle?: string;
  description?: string;

  confirmText?: string;
  confirmDisabled?: boolean;
  confirmActionColor?: ActionColor;
  confirmAction?: () => void;

  cancelText?: string;
  cancelActionColor?: ActionColor;
  cancelAction?: () => void;

  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SimpleModal({
  title,
  subtitle,
  description,

  confirmText,
  confirmDisabled,
  confirmActionColor,
  confirmAction,

  cancelText,
  cancelActionColor,
  cancelAction,

  open,
  setOpen,
}: SimpleModalProps) {
  return (
    <Modal open={open} setOpen={setOpen}>
      <View className="flex gap-2">
        <Text size="2xl" weight="bold">
          {title}
        </Text>

        {subtitle && (
          <Text size="lg" weight="medium">
            {subtitle}
          </Text>
        )}

        {description && <Text>{description}</Text>}

        <View className="flex flex-row justify-end items-center gap-2 mt-2">
          <Button
            type="outlined"
            action={cancelActionColor ?? "primary"}
            text={cancelText ?? "Cancel"}
            onClick={() => {
              if (cancelAction) cancelAction();
              setOpen(false);
            }}
          />

          <Button
            type="outlined"
            disabled={confirmDisabled}
            action={confirmActionColor ?? "primary"}
            text={confirmText ?? "Confirm"}
            onClick={confirmAction}
          />
        </View>
      </View>
    </Modal>
  );
}
