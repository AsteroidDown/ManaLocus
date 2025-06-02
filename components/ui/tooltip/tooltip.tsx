import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  LayoutRectangle,
  Pressable,
  View,
  ViewProps,
  useWindowDimensions,
} from "react-native";
import { Portal } from "react-native-portalize";
import Text from "../text/text";

const MAX_WIDTH = 300;
const OFFSET = 8;

export type TooltipProps = ViewProps & {
  text?: string;
  content?: ReactNode;
  elevation?: number;
  delay?: number;
  placement?: "top" | "bottom";
  containerClasses?: string;
};

export default function Tooltip({
  text,
  content,
  elevation,
  children,
  className,
  delay = 250,
  placement = "bottom",
  containerClasses,
}: TooltipProps) {
  const window = useWindowDimensions();

  const childRef = useRef<View>(null);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const [visible, setVisible] = useState(false);
  const [fade, setFade] = useState(false);
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [actualPlacement, setActualPlacement] = useState<"top" | "bottom">(
    placement
  );

  useEffect(() => {
    if (visible) setTimeout(() => setFade(true), 100);
    else setFade(false);
  }, [visible]);

  function show() {
    timeout.current = setTimeout(() => {
      if (!childRef.current) return;

      childRef.current.measureInWindow((x, y) => {
        setPosition({ x, y });
        setVisible(true);
      });
    }, delay);
  }

  function hide() {
    if (timeout.current) clearTimeout(timeout.current);
    setVisible(false);
    setActualPlacement(placement);
  }

  if (!text && !content) return children;

  return (
    <Pressable className={`relative ${containerClasses}`}>
      <View
        ref={childRef}
        onPointerEnter={show}
        onPointerLeave={hide}
        onLayout={(event) => setLayout(event.nativeEvent.layout)}
      >
        {children}
      </View>

      <Portal>
        {visible && layout && (
          <View
            onLayout={(event) => {
              const { width: measuredWidth, height: measuredHeight } =
                event.nativeEvent.layout;

              const tooltipHeight = measuredHeight;
              const triggerBottom = position.y + layout.height;
              const spaceBelow = window.height - triggerBottom;
              const spaceAbove = position.y;

              if (
                placement === "bottom" &&
                spaceBelow < tooltipHeight + OFFSET
              ) {
                setActualPlacement("top");
              } else if (
                placement === "top" &&
                spaceAbove < tooltipHeight + OFFSET
              ) {
                setActualPlacement("bottom");
              }

              setHeight(tooltipHeight);
              setWidth(Math.min(measuredWidth, MAX_WIDTH));
            }}
            style={{
              elevation: elevation ?? 6,
              maxWidth: MAX_WIDTH,
              position: "absolute",
              top:
                actualPlacement === "top"
                  ? position.y - height - OFFSET
                  : position.y + layout.height + OFFSET,

              left: Math.min(
                position.x + layout.width / 2 - width / 2,
                window.width - width
              ),
            }}
          >
            <View
              className={`${className} ${
                fade ? "opacity-100" : "opacity-0"
              } flex gap-2 px-2 py-1 bg-dark-100 bg-opacity-95 border border-dark-300 rounded-lg transition-opacity duration-300`}
            >
              {(text?.length || 0) > 0 && (
                <Text size="sm" className="text-center">
                  {text}
                </Text>
              )}

              {content}
            </View>
          </View>
        )}
      </Portal>
    </Pressable>
  );
}
