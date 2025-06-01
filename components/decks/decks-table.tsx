import { LostURL } from "@/constants/urls";
import { titleCase } from "@/functions/text-manipulation";
import { AdType } from "@/models/ads/ads";
import { Deck } from "@/models/deck/deck";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faPatreon, IconDefinition } from "@fortawesome/free-brands-svg-icons";
import moment from "moment";
import { Image, View, ViewProps } from "react-native";
import CardText from "../cards/card-text";
import Icon from "../ui/icon/icon";
import LoadingTable from "../ui/table/loading-table";
import Table, { TableColumn } from "../ui/table/table";
import Text from "../ui/text/text";

export interface DeckTableAd {
  type: AdType;
  title: string;
  url: string;

  imageURL?: string;
  icon?: IconProp | IconDefinition;
}

export type DecksTableProps = ViewProps & {
  decks: (Deck | DeckTableAd)[];
  loading?: boolean;

  hideHeader?: boolean;
  hideCreator?: boolean;
  hideFormat?: boolean;
  hideModified?: boolean;
  hideFavorites?: boolean;
  hideViews?: boolean;

  startColumns?: TableColumn<Deck | DeckTableAd>[];
  endColumns?: TableColumn<Deck | DeckTableAd>[];

  rowClick?: (arg: Deck | DeckTableAd) => void;
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

  const columns: TableColumn<Deck | DeckTableAd>[] = [];

  if (startColumns?.length) {
    columns.push(...startColumns);
  }

  columns.push(
    {
      fit: true,
      row: (deck: any) =>
        deck?.icon ? (
          <Icon
            icon={deck.icon}
            className={`${
              deck.icon === faPatreon ? "text-patreon" : ""
            } h-4 w-10 rounded`}
          />
        ) : (
          <Image
            className="h-7 w-10 rounded"
            source={{
              uri: deck?.featuredArtUrl?.length ? deck.featuredArtUrl : LostURL,
            }}
          />
        ),
    },
    {
      title: "Name",
      row: (deck: any) => <Text>{deck?.name || deck?.title}</Text>,
    },
    {
      fit: true,
      center: true,
      row: (deck: any) =>
        (deck?.colors?.length || 0) > 0 && (
          <View className="max-w-fit py-0.5 px-1 bg-background-200 rounded-full overflow-hidden">
            <CardText text={deck?.colors} />
          </View>
        ),
    }
  );

  if (!hideFormat) {
    columns.push({
      title: "Format",
      row: (deck: any) => <Text>{titleCase(deck?.format)}</Text>,
    });
  }

  if (!hideCreator) {
    columns.push({
      title: "Creator",
      row: (deck: any) => <Text>{deck?.user?.name}</Text>,
    });
  }

  if (!hideModified) {
    columns.push({
      title: "Modified",
      row: (deck: any) =>
        deck?.updated && (
          <Text>{moment(deck?.updated).format("MMM Do, YYYY")}</Text>
        ),
    });
  }

  if (!hideFavorites) {
    columns.push({
      fit: true,
      center: true,
      title: "Favorites",
      row: (deck: any) => <Text>{deck?.favorites}</Text>,
    });
  }

  if (!hideViews) {
    columns.push({
      fit: true,
      center: true,
      title: "Views",
      row: (deck: any) => <Text>{deck?.views}</Text>,
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
