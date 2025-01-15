import React from "react";
import { Pressable, View, ViewProps } from "react-native";
import Text from "../text/text";

export interface TableColumn<T> {
  title?: string;

  fit?: boolean;
  center?: boolean;

  row: (arg: T, index: number) => React.ReactNode;
}

export type TableProps<T> = ViewProps & {
  data: T[];
  columns: TableColumn<T>[];

  hideHeader?: boolean;
  lightBackground?: boolean;

  rowClick?: (arg: T) => void;
};

export default function Table({
  data,
  columns,
  hideHeader,
  lightBackground,
  rowClick,
  className,
}: TableProps<any>) {
  const [hoveredIndex, setHoveredIndex] = React.useState(-1);

  return (
    <View className={`${className} flex flex-row overflow-x-auto`}>
      {columns.map((column, index) => (
        <View
          key={index}
          className={`${column.fit ? "max-w-fit" : "flex-1 min-w-max"} flex`}
        >
          {!hideHeader && (
            <View
              className={`sticky top-0 flex flex-row items-center h-10 max-h-10 px-4 border-b border-background-300 overflow-hidden z-10 ${
                column.center ? "justify-center" : "justify-start"
              } ${lightBackground ? "bg-background-200" : "bg-background-100"}`}
            >
              <Text key={index} thickness="semi">
                {column.title}
              </Text>
            </View>
          )}

          <View className="flex">
            {data.map((rowData, rowIndex) => (
              <Pressable
                key={rowIndex}
                onPress={() => rowClick?.(data[rowIndex])}
                onHoverIn={() => setHoveredIndex(rowIndex)}
                onHoverOut={() => setHoveredIndex(-1)}
                className={`flex flex-row items-center h-10 max-h-10 px-4 border-b border-background-300 overflow-hidden transition-all duration-300 ${
                  column.center ? "justify-center" : "justify-start"
                } ${
                  hoveredIndex === rowIndex
                    ? "bg-background-600 bg-opacity-30"
                    : ""
                }`}
              >
                {column.row(rowData, rowIndex)}
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
