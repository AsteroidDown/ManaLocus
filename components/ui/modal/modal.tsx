import { faX, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  Pressable,
  Modal as ReactModal,
  ScrollView,
  View,
  ViewProps,
} from "react-native";
import Box from "../box/box";
import BoxHeader from "../box/box-header";
import Button from "../button/button";

export type ModalProps = ViewProps & {
  title?: string;
  subtitle?: string;
  icon?: IconDefinition;

  end?: ReactNode;

  footer?: ReactNode;

  transparent?: boolean;

  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Modal({
  title,
  subtitle,
  icon,
  end,
  footer,
  transparent = false,
  open,
  setOpen,
  className,
  children,
}: ModalProps) {
  const [animate, setAnimate] = useState(true);

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
                      <View className="flex">
                        <BoxHeader
                          title={title}
                          startIcon={icon}
                          subtitle={subtitle}
                          className="!flex-nowrap !pb-2"
                          end={
                            <View className="flex flex-row gap-2 justify-end items-center">
                              {end}

                              <Button
                                rounded
                                size="sm"
                                type="clear"
                                icon={faX}
                                action="default"
                                className="lg:hidden -mr-2 self-start"
                                onClick={fadeOut}
                              />
                            </View>
                          }
                        />
                      </View>

                      <ScrollView>{children}</ScrollView>

                      {footer && <View className="mt-4">{footer}</View>}
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
