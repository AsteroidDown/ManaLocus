import Box from "@/components/ui/box/box";
import BoxHeader from "@/components/ui/box/box-header";
import FilterBar from "@/components/ui/filters/filter-bar";
import { BoardTypes } from "@/constants/boards";
import BoardContext from "@/contexts/cards/board.context";
import StoredCardsContext from "@/contexts/cards/stored-cards.context";
import { filterCards } from "@/functions/card-filtering";
import {
  groupCardsByColor,
  groupCardsByCost,
  groupCardsByType,
} from "@/functions/card-grouping";
import {
  sortCards,
  sortCardsAlphabetically,
  sortCardsByManaValue,
} from "@/functions/card-sorting";
import { getCountOfCards, getTotalValueOfCards } from "@/functions/card-stats";
import { getLocalStorageStoredCards } from "@/functions/local-storage/card-local-storage";
import { titleCase } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import {
  CardFilters,
  CardFilterSortType,
  CardsSortedByColor,
  CardsSortedByCost,
  CardsSortedByType,
} from "@/models/sorted-cards/sorted-cards";
import {
  faChartSimple,
  faDownLeftAndUpRightToCenter,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import Button from "../ui/button/button";
import CardItemGalleryColumn from "./card-item-gallery-column";
import CardSaveAsChartModal from "./card-save-as-chart-modal";
import CardSaveAsGraphModal from "./card-save-as-graph-modal";

export interface CardItemGalleryProps {
  type: CardFilterSortType;

  condensed: boolean;
  groupMulticolored: boolean;
  hideImages: boolean;
}

export default function CardItemGallery({
  type = "cost",
  condensed,
  groupMulticolored,
  hideImages,
}: CardItemGalleryProps) {
  const { board } = useContext(BoardContext);
  const { storedCards } = useContext(StoredCardsContext);

  const [itemsExpanded, setItemsExpanded] = React.useState(0);

  const [saveAsGraphOpen, setSaveAsGraphOpen] = React.useState(false);
  const [saveAsChartOpen, setSaveAsChartOpen] = React.useState(false);

  const [cards, setCards] = React.useState([] as Card[]);

  const [cardCount, setCardCount] = React.useState(0);
  const [cardsValue, setCardsValue] = React.useState(0);

  const [filters, setFilters] = React.useState({} as CardFilters);

  const [cardsSortedByCost, setCardsSortedByCost] = React.useState(
    {} as CardsSortedByCost
  );
  const [cardsSortedByColor, setCardsSortedByColor] = React.useState(
    {} as CardsSortedByColor
  );
  const [cardsSortedByType, setCardsSortedByType] = React.useState(
    {} as CardsSortedByType
  );

  useEffect(
    () => setCards(sortCardsAlphabetically(getLocalStorageStoredCards(board))),
    [storedCards]
  );

  useEffect(() => {
    setCards(sortCardsAlphabetically(getLocalStorageStoredCards(board)));
  }, []);

  useEffect(() => {
    let sortedCards: Card[] = [];

    if (
      filters.priceSort ||
      filters.manaValueSort ||
      filters.alphabeticalSort
    ) {
      sortedCards = sortCards(cards, filters);
    } else {
      sortedCards = sortCardsByManaValue(sortCardsAlphabetically(cards));
    }

    const filteredCards = filterCards(sortedCards, filters);

    setCardCount(getCountOfCards(filteredCards));
    setCardsValue(getTotalValueOfCards(filteredCards));

    if (type === "cost") {
      setCardsSortedByCost(groupCardsByCost(filteredCards));
    }
    if (type === "color") {
      setCardsSortedByColor(groupCardsByColor(filteredCards));
    }
    if (type === "type") {
      setCardsSortedByType(groupCardsByType(filteredCards));
    }
  }, [cards, filters]);

  return (
    <Box className="!rounded-tl-none flex gap-2 px-0 overflow-hidden">
      <BoxHeader
        title={
          "Cards Sorted by " +
          (type === "cost" ? "Mana Value" : titleCase(type))
        }
        startIcon={faChartSimple}
        subtitle={`${cardCount} Card${
          cardCount !== 1 ? "s" : ""
        } | Total Value: $${cardsValue.toFixed(2)}`}
        end={
          <View className="flex flex-row gap-2">
            <FilterBar type={type} setFilters={setFilters} />

            <View
              className={`${
                itemsExpanded ? "max-w-10 mx-0" : "max-w-0 -ml-2"
              } flex flex-row overflow-hidden transition-all duration-300`}
            >
              <Button
                rounded
                type="clear"
                className="-rotate-45"
                icon={faDownLeftAndUpRightToCenter}
                onClick={() => setItemsExpanded(0)}
              />
            </View>

            {board === BoardTypes.MAIN && (
              <>
                <View className="-mx-1">
                  <CardSaveAsGraphModal
                    type={type}
                    open={saveAsGraphOpen}
                    setOpen={setSaveAsGraphOpen}
                  />
                </View>

                <Button
                  rounded
                  type="clear"
                  icon={faChartSimple}
                  onClick={() => setSaveAsGraphOpen(true)}
                />

                <View className="-mx-1">
                  <CardSaveAsChartModal
                    type={type === "type" ? "type" : "cost"}
                    open={saveAsChartOpen}
                    setOpen={setSaveAsChartOpen}
                  />
                </View>

                <Button
                  rounded
                  type="clear"
                  icon={faTable}
                  onClick={() => setSaveAsChartOpen(true)}
                />
              </>
            )}
          </View>
        }
      />

      <View className="overflow-x-scroll overflow-y-hidden">
        {type === "cost" && cardsSortedByCost.one && (
          <View className="flex flex-row gap-4 w-full min-h-[500px]">
            {cardsSortedByCost.zero?.length > 0 && (
              <CardItemGalleryColumn
                title="0 Cost"
                condensed={condensed}
                hideImages={hideImages}
                itemsExpanded={itemsExpanded}
                setItemExpanded={setItemsExpanded}
                groupMulticolored={groupMulticolored}
                cards={cardsSortedByCost.zero}
              />
            )}
            <CardItemGalleryColumn
              title="1 Cost"
              condensed={condensed}
              hideImages={hideImages}
              itemsExpanded={itemsExpanded}
              setItemExpanded={setItemsExpanded}
              groupMulticolored={groupMulticolored}
              cards={cardsSortedByCost.one}
            />
            <CardItemGalleryColumn
              title="2 Cost"
              condensed={condensed}
              hideImages={hideImages}
              itemsExpanded={itemsExpanded}
              setItemExpanded={setItemsExpanded}
              groupMulticolored={groupMulticolored}
              cards={cardsSortedByCost.two}
            />
            <CardItemGalleryColumn
              title="3 Cost"
              condensed={condensed}
              hideImages={hideImages}
              itemsExpanded={itemsExpanded}
              setItemExpanded={setItemsExpanded}
              groupMulticolored={groupMulticolored}
              cards={cardsSortedByCost.three}
            />
            <CardItemGalleryColumn
              title="4 Cost"
              condensed={condensed}
              hideImages={hideImages}
              itemsExpanded={itemsExpanded}
              setItemExpanded={setItemsExpanded}
              groupMulticolored={groupMulticolored}
              cards={cardsSortedByCost.four}
            />
            <CardItemGalleryColumn
              title="5 Cost"
              condensed={condensed}
              hideImages={hideImages}
              itemsExpanded={itemsExpanded}
              setItemExpanded={setItemsExpanded}
              groupMulticolored={groupMulticolored}
              cards={cardsSortedByCost.five}
            />
            {cardsSortedByCost.six?.length > 0 && (
              <CardItemGalleryColumn
                title="6+ Cost"
                condensed={condensed}
                hideImages={hideImages}
                itemsExpanded={itemsExpanded}
                setItemExpanded={setItemsExpanded}
                groupMulticolored={groupMulticolored}
                cards={cardsSortedByCost.six}
              />
            )}
            {cardsSortedByCost.land?.length > 0 && (
              <CardItemGalleryColumn
                title="Lands"
                condensed={condensed}
                hideImages={hideImages}
                itemsExpanded={itemsExpanded}
                setItemExpanded={setItemsExpanded}
                groupMulticolored={groupMulticolored}
                cards={cardsSortedByCost.land}
              />
            )}
          </View>
        )}

        {type === "color" && cardsSortedByColor.white && (
          <View className="flex flex-row gap-4 w-full min-h-[500px]">
            <CardItemGalleryColumn
              title="White"
              condensed={condensed}
              hideImages={hideImages}
              itemsExpanded={itemsExpanded}
              setItemExpanded={setItemsExpanded}
              groupMulticolored={groupMulticolored}
              cards={cardsSortedByColor.white}
            />
            <CardItemGalleryColumn
              title="Blue"
              condensed={condensed}
              hideImages={hideImages}
              itemsExpanded={itemsExpanded}
              setItemExpanded={setItemsExpanded}
              groupMulticolored={groupMulticolored}
              cards={cardsSortedByColor.blue}
            />
            <CardItemGalleryColumn
              title="Black"
              condensed={condensed}
              hideImages={hideImages}
              itemsExpanded={itemsExpanded}
              setItemExpanded={setItemsExpanded}
              groupMulticolored={groupMulticolored}
              cards={cardsSortedByColor.black}
            />
            <CardItemGalleryColumn
              title="Red"
              condensed={condensed}
              hideImages={hideImages}
              itemsExpanded={itemsExpanded}
              setItemExpanded={setItemsExpanded}
              groupMulticolored={groupMulticolored}
              cards={cardsSortedByColor.red}
            />
            <CardItemGalleryColumn
              title="Green"
              condensed={condensed}
              hideImages={hideImages}
              itemsExpanded={itemsExpanded}
              setItemExpanded={setItemsExpanded}
              groupMulticolored={groupMulticolored}
              cards={cardsSortedByColor.green}
            />
            <CardItemGalleryColumn
              title="Gold"
              condensed={condensed}
              hideImages={hideImages}
              itemsExpanded={itemsExpanded}
              setItemExpanded={setItemsExpanded}
              groupMulticolored={groupMulticolored}
              cards={cardsSortedByColor.gold}
            />
            <CardItemGalleryColumn
              title="Colorless"
              condensed={condensed}
              hideImages={hideImages}
              itemsExpanded={itemsExpanded}
              setItemExpanded={setItemsExpanded}
              groupMulticolored={groupMulticolored}
              cards={cardsSortedByColor.colorless}
            />
            <CardItemGalleryColumn
              title="Land"
              condensed={condensed}
              hideImages={hideImages}
              itemsExpanded={itemsExpanded}
              setItemExpanded={setItemsExpanded}
              groupMulticolored={groupMulticolored}
              cards={cardsSortedByColor.land}
            />
          </View>
        )}

        {type === "type" && cardsSortedByType.creature && (
          <View className="flex flex-row gap-4 w-full min-h-[500px]">
            <CardItemGalleryColumn
              title="Creature"
              condensed={condensed}
              hideImages={hideImages}
              itemsExpanded={itemsExpanded}
              setItemExpanded={setItemsExpanded}
              groupMulticolored={groupMulticolored}
              cards={cardsSortedByType.creature}
            />
            <CardItemGalleryColumn
              title="Instant"
              condensed={condensed}
              hideImages={hideImages}
              itemsExpanded={itemsExpanded}
              setItemExpanded={setItemsExpanded}
              groupMulticolored={groupMulticolored}
              cards={cardsSortedByType.instant}
            />
            <CardItemGalleryColumn
              title="Sorcery"
              condensed={condensed}
              hideImages={hideImages}
              itemsExpanded={itemsExpanded}
              setItemExpanded={setItemsExpanded}
              groupMulticolored={groupMulticolored}
              cards={cardsSortedByType.sorcery}
            />
            <CardItemGalleryColumn
              title="Artifact"
              condensed={condensed}
              hideImages={hideImages}
              itemsExpanded={itemsExpanded}
              setItemExpanded={setItemsExpanded}
              groupMulticolored={groupMulticolored}
              cards={cardsSortedByType.artifact}
            />
            <CardItemGalleryColumn
              title="Enchantment"
              condensed={condensed}
              hideImages={hideImages}
              itemsExpanded={itemsExpanded}
              setItemExpanded={setItemsExpanded}
              groupMulticolored={groupMulticolored}
              cards={cardsSortedByType.enchantment}
            />
            {cardsSortedByType.planeswalker?.length > 0 && (
              <CardItemGalleryColumn
                title="Planeswalker"
                condensed={condensed}
                hideImages={hideImages}
                itemsExpanded={itemsExpanded}
                setItemExpanded={setItemsExpanded}
                groupMulticolored={groupMulticolored}
                cards={cardsSortedByType.planeswalker}
              />
            )}
            {cardsSortedByType.battle?.length > 0 && (
              <CardItemGalleryColumn
                title="Battle"
                condensed={condensed}
                hideImages={hideImages}
                itemsExpanded={itemsExpanded}
                setItemExpanded={setItemsExpanded}
                groupMulticolored={groupMulticolored}
                cards={cardsSortedByType.battle}
              />
            )}
            <CardItemGalleryColumn
              title="Land"
              condensed={condensed}
              hideImages={hideImages}
              itemsExpanded={itemsExpanded}
              setItemExpanded={setItemsExpanded}
              groupMulticolored={groupMulticolored}
              cards={cardsSortedByType.land}
            />
          </View>
        )}
      </View>
    </Box>
  );
}
