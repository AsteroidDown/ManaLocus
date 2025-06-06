import DropdownContext from "@/contexts/ui/dropdown.context";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Modal,
  Pressable,
  View,
  ViewProps,
  useWindowDimensions,
} from "react-native";

export type DropdownProps = ViewProps & {
  disableCloseOnClick?: boolean;
  horizontal?: "left" | "center" | "right";
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
};

export default function Dropdown({
  expanded,
  setExpanded,
  disableCloseOnClick = false,
  className,
  horizontal = "right",
  children,
}: DropdownProps) {
  return (
    <DropdownContext.Provider value={{ expanded, setExpanded }}>
      <DropdownContent
        className={className}
        disableCloseOnClick={disableCloseOnClick}
        horizontal={horizontal}
      >
        {children}
      </DropdownContent>
    </DropdownContext.Provider>
  );
}

const VerticalOffset = 16;
const HorizontalOffset = 8;

type DropdownContentProps = ViewProps & {
  disableCloseOnClick: boolean;
  horizontal: "left" | "center" | "right";
};

function DropdownContent({
  disableCloseOnClick,
  className,
  horizontal,
  children,
}: DropdownContentProps) {
  const { expanded, setExpanded } = useContext(DropdownContext);
  const window = useWindowDimensions();

  const triggerRef = useRef<View>(null);
  const dropdownRef = useRef<View>(null);

  const [triggerPosition, setTriggerPosition] = useState({ x: 0, y: 0 });
  const [triggerSize, setTriggerSize] = useState({ width: 0, height: 0 });
  const [dropdownSize, setDropdownSize] = useState({ width: 0, height: 0 });

  const [visible, setVisible] = useState(false);
  const [toTop, setToTop] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setOpen(expanded), 10);
  }, [expanded]);

  useEffect(() => {
    if (expanded) {
      triggerRef.current?.measureInWindow((x, y, width, height) => {
        setTriggerPosition({ x, y });
        setTriggerSize({ width, height });
        setVisible(true);
      });
    } else {
      setVisible(false);
    }
  }, [expanded]);

  function handleDropdownLayout(event: any) {
    const { width, height } = event.nativeEvent.layout;
    setDropdownSize({ width, height });

    const spaceBelow = window.height - (triggerPosition.y + triggerSize.height);
    const spaceAbove = triggerPosition.y;

    if (spaceBelow < height && spaceAbove > height) {
      setToTop(true);
    } else {
      setToTop(false);
    }
  }

  function calculateHorizontalPosition() {
    let left = 0;

    if (horizontal === "left") {
      left = triggerPosition.x;
    } else if (horizontal === "center") {
      left = triggerPosition.x + triggerSize.width / 2 - dropdownSize.width / 2;
    } else {
      left = triggerPosition.x + triggerSize.width - dropdownSize.width;
    }

    return Math.max(
      HorizontalOffset,
      Math.min(left, window.width - dropdownSize.width)
    );
  }

  return (
    <>
      <View ref={triggerRef} collapsable={false} />

      {visible && (
        <Modal transparent animationType="none">
          <Pressable
            className="flex-1 cursor-default"
            onPress={() => setExpanded(false)}
          >
            <View
              ref={dropdownRef}
              onLayout={handleDropdownLayout}
              style={{
                position: "absolute",
                top: toTop
                  ? triggerPosition.y - dropdownSize.height - VerticalOffset
                  : triggerPosition.y + triggerSize.height + VerticalOffset,
                left: calculateHorizontalPosition(),
                zIndex: 9999,
              }}
            >
              <Pressable
                className={`overflow-hidden transition-all duration-200 ${
                  visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                onPress={() =>
                  !disableCloseOnClick ? setExpanded(false) : null
                }
              >
                <View
                  className={
                    open
                      ? "translate-y-[0%] transition-all duration-300"
                      : toTop
                      ? "translate-y-[100%]"
                      : "translate-y-[-100%]"
                  }
                >
                  <View className={className}>{children}</View>
                </View>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      )}
    </>
  );
}
