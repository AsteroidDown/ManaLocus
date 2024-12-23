import Box from "@/components/ui/box/box";
import BoxHeader from "@/components/ui/box/box-header";
import FilterBar from "@/components/ui/filters/filter-bar";
import { BoardTypes } from "@/constants/boards";
import { MTGColors } from "@/constants/mtg/mtg-colors";
import { MTGCardTypes } from "@/constants/mtg/mtg-types";
import BoardContext from "@/contexts/cards/board.context";
import StoredCardsContext from "@/contexts/cards/stored-cards.context";
import { filterCards } from "@/functions/card-filtering";
import {
  groupCardsByColor,
  groupCardsByCost,
  groupCardsByType,
  groupCardsCustom,
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
  CardsSortedCustom,
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

  groupMulticolored: boolean;
  hideImages: boolean;
}

export default function CardItemGallery({
  type = "cost",
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
  const [cardsSortedCustom, setCardsSortedCustom] = React.useState(
    {} as CardsSortedCustom
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
    if (type === "custom") {
      setCardsSortedCustom(groupCardsCustom(filteredCards));
    }
  }, [cards, filters]);

  return (
    <View className="bg-background-100">
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
          {type === "cost" && (
            <View className="flex flex-row gap-4 w-full min-h-[500px]">
              {cardsSortedByCost.zero?.length > 0 && (
                <CardItemGalleryColumn
                  title="0 Cost"
                  hideImages={hideImages}
                  itemsExpanded={itemsExpanded}
                  setItemExpanded={setItemsExpanded}
                  groupMulticolored={groupMulticolored}
                  cards={cardsSortedByCost.zero}
                />
              )}
              <CardItemGalleryColumn
                title="1 Cost"
                hideImages={hideImages}
                itemsExpanded={itemsExpanded}
                setItemExpanded={setItemsExpanded}
                groupMulticolored={groupMulticolored}
                cards={cardsSortedByCost.one}
              />
              <CardItemGalleryColumn
                title="2 Cost"
                hideImages={hideImages}
                itemsExpanded={itemsExpanded}
                setItemExpanded={setItemsExpanded}
                groupMulticolored={groupMulticolored}
                cards={cardsSortedByCost.two}
              />
              <CardItemGalleryColumn
                title="3 Cost"
                hideImages={hideImages}
                itemsExpanded={itemsExpanded}
                setItemExpanded={setItemsExpanded}
                groupMulticolored={groupMulticolored}
                cards={cardsSortedByCost.three}
              />
              <CardItemGalleryColumn
                title="4 Cost"
                hideImages={hideImages}
                itemsExpanded={itemsExpanded}
                setItemExpanded={setItemsExpanded}
                groupMulticolored={groupMulticolored}
                cards={cardsSortedByCost.four}
              />
              <CardItemGalleryColumn
                title="5 Cost"
                hideImages={hideImages}
                itemsExpanded={itemsExpanded}
                setItemExpanded={setItemsExpanded}
                groupMulticolored={groupMulticolored}
                cards={cardsSortedByCost.five}
              />
              {cardsSortedByCost.six?.length > 0 && (
                <CardItemGalleryColumn
                  title="6+ Cost"
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
                  hideImages={hideImages}
                  itemsExpanded={itemsExpanded}
                  setItemExpanded={setItemsExpanded}
                  groupMulticolored={groupMulticolored}
                  cards={cardsSortedByCost.land}
                />
              )}
            </View>
          )}

          {type === "color" && (
            <View className="flex flex-row gap-4 w-full min-h-[500px]">
              {[
                MTGColors.WHITE,
                MTGColors.BLUE,
                MTGColors.BLACK,
                MTGColors.RED,
                MTGColors.GREEN,
                MTGColors.GOLD,
                MTGColors.COLORLESS,
                MTGColors.LAND,
              ].map((color, index) => (
                <CardItemGalleryColumn
                  key={index}
                  title={titleCase(color)}
                  hideImages={hideImages}
                  itemsExpanded={itemsExpanded}
                  setItemExpanded={setItemsExpanded}
                  groupMulticolored={groupMulticolored}
                  cards={cardsSortedByColor[color]}
                />
              ))}
            </View>
          )}

          {type === "type" && (
            <View className="flex flex-row gap-4 w-full min-h-[500px]">
              {[
                MTGCardTypes.CREATURE,
                MTGCardTypes.INSTANT,
                MTGCardTypes.SORCERY,
                MTGCardTypes.ARTIFACT,
                MTGCardTypes.ENCHANTMENT,
              ].map((type, index) => (
                <CardItemGalleryColumn
                  key={index}
                  title={titleCase(type)}
                  hideImages={hideImages}
                  itemsExpanded={itemsExpanded}
                  setItemExpanded={setItemsExpanded}
                  groupMulticolored={groupMulticolored}
                  cards={cardsSortedByType[type]}
                />
              ))}
              {cardsSortedByType.planeswalker?.length > 0 && (
                <CardItemGalleryColumn
                  title="Planeswalker"
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
                  hideImages={hideImages}
                  itemsExpanded={itemsExpanded}
                  setItemExpanded={setItemsExpanded}
                  groupMulticolored={groupMulticolored}
                  cards={cardsSortedByType.battle}
                />
              )}
              <CardItemGalleryColumn
                title="Land"
                hideImages={hideImages}
                itemsExpanded={itemsExpanded}
                setItemExpanded={setItemsExpanded}
                groupMulticolored={groupMulticolored}
                cards={cardsSortedByType.land}
              />
            </View>
          )}

          {type === "custom" && (
            <View className="flex flex-row gap-4 w-full min-h-[500px]">
              {Object.keys(cardsSortedCustom).map((group, index) => (
                <CardItemGalleryColumn
                  key={index}
                  title={titleCase(group)}
                  hideImages={hideImages}
                  itemsExpanded={itemsExpanded}
                  setItemExpanded={setItemsExpanded}
                  groupMulticolored={groupMulticolored}
                  cards={cardsSortedCustom[group]}
                />
              ))}
            </View>
          )}
        </View>
      </Box>
    </View>
  );
}
