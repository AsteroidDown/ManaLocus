import CardList from "@/components/cards/card-list";
import BoxHeader from "@/components/ui/box/box-header";
import Button from "@/components/ui/button/button";
import Placeholder from "@/components/ui/placeholder/placeholder";
import ScryfallService from "@/hooks/services/scryfall.service";
import { Card, CardIdentifier } from "@/models/card/card";
import { DeckViewType } from "@/models/deck/dtos/deck-filters.dto";
import {
  faBorderAll,
  faList,
  faRotate,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { ReactNode, useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";

export interface SpecialCardListProps {
  title: string;
  subtitle: string | ReactNode;
  description?: string | ReactNode;
  identifiers: CardIdentifier[];
}

export default function SpecialCardList({
  title,
  subtitle,
  description,
  identifiers,
}: SpecialCardListProps) {
  const [viewType, setViewType] = useState(DeckViewType.CARD);

  const [cards, setCards] = useState([] as Card[]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (total) return;

    setLoading(true);

    ScryfallService.getCardsFromCollection(identifiers).then((response) => {
      setLoading(false);
      setCards(response.sort((a, b) => a.name.localeCompare(b.name)));
      setTotal(response.length);
    });
  });

  return (
    <SafeAreaView className="flex-1">
      <View className="flex flex-1 lg:px-16 px-4 py-4 min-h-[100dvh] bg-dark-100">
        <BoxHeader
          className="!pb-0"
          title={title}
          subtitle={subtitle}
          end={
            <View className="flex flex-row">
              <Button
                size="sm"
                squareRight
                icon={faBorderAll}
                type={viewType === DeckViewType.CARD ? "default" : "outlined"}
                onClick={() => setViewType(DeckViewType.CARD)}
              />

              <Button
                size="sm"
                squareLeft
                icon={faList}
                type={viewType === DeckViewType.LIST ? "default" : "outlined"}
                onClick={() => setViewType(DeckViewType.LIST)}
              />
            </View>
          }
        />

        {description}

        {!cards?.length &&
          (loading ? (
            <Button disabled type="clear" text="Loading..." icon={faRotate} />
          ) : (
            <Placeholder icon={faSearch} title="No Cards Found" />
          ))}

        <CardList includeSet cards={cards} viewType={viewType} />
      </View>
    </SafeAreaView>
  );
}
