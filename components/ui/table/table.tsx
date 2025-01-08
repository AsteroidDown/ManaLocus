import React from "react";
import { Pressable, View } from "react-native";
import Text from "../text/text";

interface TableColumn {
  title?: string;

  fit?: boolean;
  center?: boolean;

  row: any[];
}

export interface TableProps {
  data: any[];
  columns: TableColumn[];

  rowClick?: (arg: any) => void;
}

export default function Table({ data, columns, rowClick }: TableProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState(-1);

  return (
    <View className="flex flex-row px-2 overflow-x-auto">
      {columns.map((column, index) => (
        <View
          key={index}
          className={`${column.fit ? "max-w-fit" : "flex-1 min-w-max"} flex`}
        >
          <View className="sticky top-0 flex flex-row items-center h-10 max-h-10 px-4 border-b border-background-300 overflow-hidden">
            <Text key={index} thickness="semi">
              {column.title}
            </Text>
          </View>

          <View className="flex">
            {column.row.map((cell, rowIndex) => (
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
                {cell}
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
