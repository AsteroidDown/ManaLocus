import Button from "@/components/ui/button/button";
import Text from "@/components/ui/text/text";
import DashboardContext from "@/contexts/dashboard/dashboard.context";
import {
  getLocalStorageDashboard,
  updateLocalStorageDashboardItem,
} from "@/functions/local-storage/dashboard-local-storage";
import { faCheck, faPencil } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode, useContext } from "react";
import { TextInput, View, ViewProps } from "react-native";
import Divider from "../ui/divider/divider";

export type DashboardItemHeaderProps = ViewProps & {
  itemId?: string;
  sectionId?: string;

  title: string;
  titleStart?: ReactNode;
  titleEnd?: ReactNode;

  readonly?: boolean;
  hideDivider?: boolean;
};

export default function DashboardItemHeader({
  itemId,
  sectionId,
  title,
  titleStart,
  titleEnd,
  readonly = false,
  hideDivider = false,
  className,
}: DashboardItemHeaderProps) {
  const { setDashboard } = useContext(DashboardContext);

  const [hovered, setHovered] = React.useState(false);

  const [editingItem, setEditingItem] = React.useState(false);
  const [itemTitle, setItemTitle] = React.useState("");

  function updateItemTitle() {
    if (!itemId || !sectionId) return;

    if (!itemTitle) {
      setEditingItem(false);
      return;
    }

    updateLocalStorageDashboardItem(itemId, sectionId, { title: itemTitle });
    setDashboard(getLocalStorageDashboard());
    setEditingItem(false);
  }

  return (
    <View className="flex w-full">
      <View
        className={`${className} flex flex-row w-full items-center`}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {titleStart && (
          <View
            className={`${
              hovered || readonly ? "opacity-100" : "opacity-0"
            } transition-all duration-500`}
          >
            {titleStart}
          </View>
        )}

        <View className="flex-1 flex-row justify-center items-center mx-auto pl-10">
          {!editingItem && (
            <Text
              size="xl"
              weight="bold"
              className="max-h-fit text-center mx-4 my-2"
            >
              {title}
            </Text>
          )}

          {editingItem && !readonly && (
            <TextInput
              placeholderTextColor="#8b8b8b"
              className="color-white outline-none text-xl font-bold mx-4 my-2"
              value={itemTitle}
              placeholder={title}
              onChangeText={(text) => setItemTitle(text)}
              onKeyPress={(event) =>
                (event as any)?.code === "Enter" ? updateItemTitle() : null
              }
            />
          )}

          <Button
            rounded
            type="clear"
            action="default"
            icon={editingItem ? faCheck : faPencil}
            className={`${
              (editingItem || hovered) && !readonly
                ? "opacity-100"
                : "opacity-0"
            } transition-all duration-500`}
            onClick={() =>
              editingItem ? updateItemTitle() : setEditingItem(!editingItem)
            }
          />
        </View>

        {titleEnd && (
          <View
            className={`${
              hovered ? "opacity-100" : "opacity-0"
            } transition-all duration-500`}
          >
            {titleEnd}
          </View>
        )}
      </View>

      {!hideDivider && <Divider thick className="!border-background-300" />}
    </View>
  );
}
