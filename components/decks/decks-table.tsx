import { LostURL } from "@/constants/urls";
import { titleCase } from "@/functions/text-manipulation";
import { Deck } from "@/models/deck/deck";
import moment from "moment";
import { Image, View, ViewProps } from "react-native";
import CardText from "../cards/card-text";
import LoadingTable from "../ui/table/loading-table";
import Table, { TableColumn } from "../ui/table/table";
import Text from "../ui/text/text";

export type DecksTableProps = ViewProps & {
  decks: Deck[];
  loading?: boolean;

  hideHeader?: boolean;
  hideCreator?: boolean;
  hideFormat?: boolean;
  hideModified?: boolean;
  hideFavorites?: boolean;
  hideViews?: boolean;

  startColumns?: TableColumn<Deck>[];
  endColumns?: TableColumn<Deck>[];

  rowClick?: (arg: Deck) => void;
};

export default function DecksTable({
  decks,
  loading,
  hideHeader,
  hideCreator,
  hideFormat,
  hideModified,
  hideFavorites,
  hideViews,
  startColumns,
  endColumns,
  rowClick,
  className,
}: DecksTableProps) {
  if (loading) return <LoadingTable />;

  const columns: TableColumn<Deck>[] = [];

  if (startColumns?.length) {
    columns.push(...startColumns);
  }

  columns.push(
    {
      fit: true,
      row: (deck) => (
        <Image
          source={{
            uri: deck.featuredArtUrl?.length ? deck.featuredArtUrl : LostURL,
          }}
          className="h-7 w-10 rounded"
        />
      ),
    },
    {
      fit: true,
      title: "Name",
      row: (deck) => <Text>{deck.name}</Text>,
    },
    {
      fit: true,
      center: true,
      row: (deck) => (
        <View className="max-w-fit py-0.5 px-1 bg-background-200 rounded-full overflow-hidden">
          <CardText text={deck.colors} />
        </View>
      ),
    }
  );

  if (!hideFormat) {
    columns.push({
      title: "Format",
      row: (deck) => <Text>{titleCase(deck.format)}</Text>,
    });
  }

  if (!hideCreator) {
    columns.push({
      title: "Creator",
      row: (deck) => <Text>{deck.user?.name}</Text>,
    });
  }

  if (!hideModified) {
    columns.push({
      title: "Modified",
      row: (deck) => <Text>{moment(deck.updated).format("MMM D, YYYY")}</Text>,
    });
  }

  if (!hideFavorites) {
    columns.push({
      fit: true,
      center: true,
      title: "Favorites",
      row: (deck) => <Text>{deck.favorites}</Text>,
    });
  }

  if (!hideViews) {
    columns.push({
      fit: true,
      center: true,
      title: "Views",
      row: (deck) => <Text>{deck.views}</Text>,
    });
  }

  if (endColumns?.length) {
    columns.push(...endColumns);
  }

  return (
    <Table
      data={decks}
      columns={columns}
      className={className}
      hideHeader={hideHeader}
      rowClick={(deck) => rowClick?.(deck)}
    />
  );
}
