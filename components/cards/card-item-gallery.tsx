import Box from "@/components/ui/box/box";
import BoxHeader from "@/components/ui/box/box-header";
import { BoardTypes } from "@/constants/boards";
import { BracketDetails } from "@/constants/mtg/brackets";
import { MTGColors } from "@/constants/mtg/mtg-colors";
import { MTGFormats } from "@/constants/mtg/mtg-format";
import { MTGCardTypes } from "@/constants/mtg/mtg-types";
import BoardContext from "@/contexts/cards/board.context";
import BuilderPreferencesContext from "@/contexts/cards/builder-preferences.context";
import StoredCardsContext from "@/contexts/cards/stored-cards.context";
import DeckContext from "@/contexts/deck/deck.context";
import { filterCards } from "@/functions/cards/card-filtering";
import {
  groupCardsByColor,
  groupCardsByCost,
  groupCardsByType,
  groupCardsCustom,
} from "@/functions/cards/card-grouping";
import {
  sortCards,
  sortCardsAlphabetically,
  sortCardsByManaValue,
} from "@/functions/cards/card-sorting";
import {
  getCountOfCards,
  getTotalValueOfCards,
} from "@/functions/cards/card-stats";
import { getBracketDetails } from "@/functions/decks/deck-bracket";
import { getLocalStorageStoredCards } from "@/functions/local-storage/card-local-storage";
import { titleCase } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import {
  CardFilterSortType,
  CardsSortedByColor,
  CardsSortedByCost,
  CardsSortedByType,
  CardsSortedCustom,
} from "@/models/sorted-cards/sorted-cards";
import {
  faChartSimple,
  faDownLeftAndUpRightToCenter,
  faFilter,
  faPlus,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import Button from "../ui/button/button";
import Input from "../ui/input/input";
import Tooltip from "../ui/tooltip/tooltip";
import CardFiltersModal from "./card-filters-modal";
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
  const width = useWindowDimensions().width;

  const { deck, format, commander, partner } = useContext(DeckContext);
  const { board } = useContext(BoardContext);
  const { storedCards } = useContext(StoredCardsContext);
  const { preferences } = useContext(BuilderPreferencesContext);

  const [itemsExpanded, setItemsExpanded] = useState(0);

  const [cardFiltersOpen, setCardFiltersOpen] = useState(false);
  const [saveAsGraphOpen, setSaveAsGraphOpen] = useState(false);
  const [saveAsChartOpen, setSaveAsChartOpen] = useState(false);

  const [cards, setCards] = useState([] as Card[]);
  const [bracket, setBracket] = useState(
    undefined as BracketDetails | undefined
  );

  const [group, setGroup] = useState("");
  const [groupOptions, setGroupOptions] = useState([] as string[]);

  const [cardCount, setCardCount] = useState(0);
  const [cardsValue, setCardsValue] = useState(0);

  const [cardsSortedByCost, setCardsSortedByCost] = useState(
    {} as CardsSortedByCost
  );
  const [cardsSortedByColor, setCardsSortedByColor] = useState(
    {} as CardsSortedByColor
  );
  const [cardsSortedByType, setCardsSortedByType] = useState(
    {} as CardsSortedByType
  );
  const [cardsSortedCustom, setCardsSortedCustom] = useState(
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
    if (deck) setBracket(getBracketDetails(deck));
  }, [deck]);

  useEffect(() => {
    let sortedCards: Card[] = [];

    if (
      preferences?.filters?.priceSort ||
      preferences?.filters?.manaValueSort ||
      preferences?.filters?.alphabeticalSort
    ) {
      sortedCards = sortCards(cards, preferences.filters);
    } else {
      sortedCards = sortCardsByManaValue(sortCardsAlphabetically(cards));
    }

    let filteredCards = filterCards(sortedCards, preferences?.filters);

    if (commander) {
      filteredCards = filteredCards.filter(
        (card) =>
          card.scryfallId !== commander?.scryfallId &&
          card.scryfallId !== partner?.scryfallId
      );
    }

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
  }, [deck, cards, preferences, format, commander, partner]);

  useEffect(() => {
    if (!cardsSortedCustom) return;

    setGroupOptions(Object.keys(cardsSortedCustom));
  }, [cardsSortedCustom]);

  return (
    <View className="pb-4 min-h-full">
      <Box className="!bg-background-100 !rounded-none flex gap-2 overflow-hidden">
        <BoxHeader
          startIcon={faChartSimple}
          title={
            "Cards Sorted by " +
            (type === "cost" ? "Mana Value" : titleCase(type))
          }
          className={board !== BoardTypes.MAIN ? "!flex-nowrap" : ""}
          subtitle={`${
            cardCount + (commander ? 1 : 0) + (partner ? 1 : 0)
          } Card${cardCount !== 1 ? "s" : ""} | Total Value: $${(
            cardsValue +
            (commander ? commander.prices?.usd || 0 : 0) +
            (partner ? partner.prices?.usd || 0 : 0)
          ).toFixed(2)}`}
          end={
            <>
              <View className="flex flex-row">
                {board === BoardTypes.MAIN && width > 600 && (
                  <>
                    <Tooltip placement="top" text="Create Graph">
                      <Button
                        size="sm"
                        type="clear"
                        icon={faChartSimple}
                        onClick={() => setSaveAsGraphOpen(true)}
                      />
                    </Tooltip>

                    <Tooltip placement="top" text="Create Chart">
                      <Button
                        size="sm"
                        icon={faTable}
                        type="clear"
                        onClick={() => setSaveAsChartOpen(true)}
                      />
                    </Tooltip>
                  </>
                )}

                {width > 600 && (
                  <View
                    className={`${width <= 600 ? "flex-1" : ""} ${
                      itemsExpanded ? "lg:max-w-10 mx-0" : "max-w-0"
                    } overflow-hidden transition-all duration-300`}
                  >
                    <Tooltip placement="top" text="Collapse Cards">
                      <Button
                        size="sm"
                        type="clear"
                        square={width <= 600}
                        iconClasses="-rotate-45"
                        icon={faDownLeftAndUpRightToCenter}
                        onClick={() => setItemsExpanded(0)}
                      />
                    </Tooltip>
                  </View>
                )}

                <Tooltip placement="top" text="Filter Cards">
                  <Button
                    size="sm"
                    type="clear"
                    icon={faFilter}
                    onClick={() => setCardFiltersOpen(true)}
                  />
                </Tooltip>
              </View>
            </>
          }
        />

        <View className="overflow-x-scroll overflow-y-hidden">
          {type === "cost" && (
            <View className="flex flex-row gap-4 w-full min-h-[500px]">
              {board === BoardTypes.MAIN && commander && (
                <CardItemGalleryColumn
                  title={
                    format === MTGFormats.OATHBREAKER
                      ? "Oathbreaker"
                      : "Commander"
                  }
                  bracket={bracket}
                  hideImages={hideImages}
                  itemsExpanded={itemsExpanded}
                  setItemExpanded={setItemsExpanded}
                  groupMulticolored={groupMulticolored}
                  cards={[commander, ...(partner ? [partner] : [])]}
                />
              )}

              {cardsSortedByCost.zero?.length > 0 && (
                <CardItemGalleryColumn
                  title="0 Cost"
                  bracket={bracket}
                  hideImages={hideImages}
                  itemsExpanded={itemsExpanded}
                  setItemExpanded={setItemsExpanded}
                  groupMulticolored={groupMulticolored}
                  cards={cardsSortedByCost.zero}
                />
              )}
              <CardItemGalleryColumn
                title="1 Cost"
                bracket={bracket}
                hideImages={hideImages}
                itemsExpanded={itemsExpanded}
                setItemExpanded={setItemsExpanded}
                groupMulticolored={groupMulticolored}
                cards={cardsSortedByCost.one}
              />
              <CardItemGalleryColumn
                title="2 Cost"
                bracket={bracket}
                hideImages={hideImages}
                itemsExpanded={itemsExpanded}
                setItemExpanded={setItemsExpanded}
                groupMulticolored={groupMulticolored}
                cards={cardsSortedByCost.two}
              />
              <CardItemGalleryColumn
                title="3 Cost"
                bracket={bracket}
                hideImages={hideImages}
                itemsExpanded={itemsExpanded}
                setItemExpanded={setItemsExpanded}
                groupMulticolored={groupMulticolored}
                cards={cardsSortedByCost.three}
              />
              <CardItemGalleryColumn
                title="4 Cost"
                bracket={bracket}
                hideImages={hideImages}
                itemsExpanded={itemsExpanded}
                setItemExpanded={setItemsExpanded}
                groupMulticolored={groupMulticolored}
                cards={cardsSortedByCost.four}
              />
              <CardItemGalleryColumn
                title="5 Cost"
                bracket={bracket}
                hideImages={hideImages}
                itemsExpanded={itemsExpanded}
                setItemExpanded={setItemsExpanded}
                groupMulticolored={groupMulticolored}
                cards={cardsSortedByCost.five}
              />
              {cardsSortedByCost.six?.length > 0 && (
                <CardItemGalleryColumn
                  title="6+ Cost"
                  bracket={bracket}
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
                  bracket={bracket}
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
              {board === BoardTypes.MAIN && commander && (
                <CardItemGalleryColumn
                  title={
                    format === MTGFormats.OATHBREAKER
                      ? "Oathbreaker"
                      : "Commander"
                  }
                  bracket={bracket}
                  hideImages={hideImages}
                  itemsExpanded={itemsExpanded}
                  setItemExpanded={setItemsExpanded}
                  groupMulticolored={groupMulticolored}
                  cards={[commander, ...(partner ? [partner] : [])]}
                />
              )}

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
                  bracket={bracket}
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
              {board === BoardTypes.MAIN && commander && (
                <CardItemGalleryColumn
                  title={
                    format === MTGFormats.OATHBREAKER
                      ? "Oathbreaker"
                      : "Commander"
                  }
                  bracket={bracket}
                  hideImages={hideImages}
                  itemsExpanded={itemsExpanded}
                  setItemExpanded={setItemsExpanded}
                  groupMulticolored={groupMulticolored}
                  cards={[commander, ...(partner ? [partner] : [])]}
                />
              )}

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
                  bracket={bracket}
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
                  bracket={bracket}
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
                  bracket={bracket}
                  hideImages={hideImages}
                  itemsExpanded={itemsExpanded}
                  setItemExpanded={setItemsExpanded}
                  groupMulticolored={groupMulticolored}
                  cards={cardsSortedByType.battle}
                />
              )}
              <CardItemGalleryColumn
                title="Land"
                bracket={bracket}
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
              {commander && (
                <CardItemGalleryColumn
                  title={
                    format === MTGFormats.OATHBREAKER
                      ? "Oathbreaker"
                      : "Commander"
                  }
                  bracket={bracket}
                  hideImages={hideImages}
                  itemsExpanded={itemsExpanded}
                  setItemExpanded={setItemsExpanded}
                  groupMulticolored={groupMulticolored}
                  cards={[commander, ...(partner ? [partner] : [])]}
                />
              )}

              {groupOptions.map((group, index) => (
                <CardItemGalleryColumn
                  key={index}
                  groups={groupOptions}
                  title={titleCase(group)}
                  bracket={bracket}
                  hideImages={hideImages}
                  itemsExpanded={itemsExpanded}
                  setItemExpanded={setItemsExpanded}
                  groupMulticolored={groupMulticolored}
                  cards={cardsSortedCustom[group]}
                />
              ))}

              <View className="flex flex-row px-4 py-2 mt-2 max-h-fit border-2 border-background-200 bg-opacity-30 rounded-xl">
                <Input
                  squareRight
                  label="Create Group"
                  placeholder="Group Name"
                  value={group}
                  onChange={setGroup}
                />

                <Button
                  size="sm"
                  squareLeft
                  icon={faPlus}
                  type="outlined"
                  className="self-end"
                  disabled={!group || groupOptions.includes(group)}
                  onClick={() => {
                    if (!group || groupOptions.includes(group)) return;

                    setGroupOptions([...groupOptions, group]);
                  }}
                />
              </View>
            </View>
          )}
        </View>
      </Box>

      <View className="lg:-mx-1">
        <CardFiltersModal
          type={type}
          open={cardFiltersOpen}
          setOpen={setCardFiltersOpen}
        />
      </View>

      <View className="lg:-mx-1">
        <CardSaveAsChartModal
          type={type === "type" ? "type" : "cost"}
          open={saveAsChartOpen}
          setOpen={setSaveAsChartOpen}
        />
      </View>

      <View className="lg:-mx-1">
        <CardSaveAsGraphModal
          open={saveAsGraphOpen}
          setOpen={setSaveAsGraphOpen}
        />
      </View>
    </View>
  );
}
