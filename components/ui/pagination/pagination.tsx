import { PaginationMeta } from "@/hooks/pagination";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { View, ViewProps } from "react-native";
import Button from "../button/button";
import Text from "../text/text";

export type PaginationProps = ViewProps & {
  meta: PaginationMeta;

  center?: boolean;

  onChange: (page: number) => void;
};

export default function Pagination({
  meta,
  center,
  onChange,
  className,
}: PaginationProps) {
  function backPage() {
    if (meta.page > 1) onChange(meta.page - 1);
  }

  function nextPage() {
    if (meta.page < meta.totalPages) onChange(meta.page + 1);
  }

  return (
    <View
      className={`${className} flex flex-row items-center gap-2 ${
        center ? "justify-center" : "justify-end"
      }`}
    >
      <Button
        rounded
        action="default"
        type="clear"
        icon={faChevronLeft}
        disabled={meta.page <= 1}
        onClick={backPage}
      />

      <Text size="sm" thickness="semi">
        {`${meta.page} of ${meta.totalPages}`}
      </Text>

      <Button
        rounded
        action="default"
        type="clear"
        icon={faChevronRight}
        disabled={meta.page >= meta.totalPages}
        onClick={nextPage}
      />
    </View>
  );
}
