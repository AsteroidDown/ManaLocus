import { faX } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import {
  Pressable,
  Modal as ReactModal,
  ScrollView,
  View,
  ViewProps,
} from "react-native";
import Box from "../box/box";
import Button from "../button/button";

export type ModalProps = ViewProps & {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  transparent?: boolean;
};

export default function Modal({
  open,
  setOpen,
  transparent = false,
  className,
  children,
}: ModalProps) {
  const [animate, setAnimate] = React.useState(false);

  const transParentClasses = transparent
    ? "!bg-opacity-0 !border-none shadow-none"
    : "";

  useEffect(() => {
    if (open) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 10);
    }
  }, [open]);

  return (
    <>
      {open && (
        <Pressable onPress={() => setOpen(false)}>
          <ReactModal transparent style={[{ opacity: 0 }]}>
            <View
              className={`flex justify-center items-center bg-dark-100 w-full h-full ${
                animate
                  ? "bg-opacity-0"
                  : "transition-all duration-500 bg-opacity-30 backdrop-blur-sm"
              }`}
            >
              <View className={`w-fit h-fit overflow-hidden`}>
                <View
                  className={`${
                    animate
                      ? "translate-y-[-110%]"
                      : "transition-all duration-500 translate-y-[0%]"
                  }`}
                >
                  <Pressable className="!cursor-default" tabIndex={-1}>
                    <Box
                      className={`
                        ${className} ${transParentClasses}
                        !bg-background-100 !border-background-200 max-h-[95dvh] max-w-[95dvw] lg:mx-0 mx-2 border-2 transition-all duration-500
                        ${animate ? "opacity-0" : "opacity-100"}`}
                    >
                      <ScrollView>{children}</ScrollView>

                      <View className="absolute top-4 right-4 lg:hidden">
                        <Button
                          rounded
                          type="clear"
                          icon={faX}
                          onClick={() => setOpen(false)}
                        />
                      </View>
                    </Box>
                  </Pressable>
                </View>
              </View>
            </View>
          </ReactModal>
        </Pressable>
      )}
    </>
  );
}
