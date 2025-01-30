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
  const [animate, setAnimate] = React.useState(true);

  const transParentClasses = transparent
    ? "!bg-opacity-0 !border-none shadow-none"
    : "";

  useEffect(() => {
    if (open) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 10);
    }
  }, [open]);

  function fadeOut() {
    setAnimate(true);
    setTimeout(() => setOpen(false), 500);
  }

  return (
    <>
      {open && (
        <Pressable onPress={fadeOut}>
          <ReactModal transparent style={[{ opacity: 0 }]}>
            <View
              className={`flex justify-center items-center bg-dark-100 w-full h-full transition-all duration-500 ${
                animate ? "bg-opacity-0" : "bg-opacity-30 backdrop-blur-sm"
              }`}
            >
              <View className={`w-fit h-fit`}>
                <View
                  className={`transition-all duration-500 ${
                    animate ? "translate-y-[-110%]" : "translate-y-[0%]"
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
                          onClick={fadeOut}
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
