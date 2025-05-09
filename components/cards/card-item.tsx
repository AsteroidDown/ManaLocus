import Button from "@/components/ui/button/button";
import Divider from "@/components/ui/divider/divider";
import Modal from "@/components/ui/modal/modal";
import Text from "@/components/ui/text/text";
import { BoardType, BoardTypes } from "@/constants/boards";
import { SideBoardLimit } from "@/constants/mtg/limits";
import BoardContext from "@/contexts/cards/board.context";
import StoredCardsContext from "@/contexts/cards/stored-cards.context";
import DeckContext from "@/contexts/deck/deck.context";
import ToastContext from "@/contexts/ui/toast.context";
import { evaluateCardLegality } from "@/functions/decks/deck-legality";
import {
  addToLocalStorageCardCount,
  getLocalStorageStoredCards,
  removeFromLocalStorageCardCount,
  removeLocalStorageCard,
  saveLocalStorageCard,
  switchLocalStorageCardPrint,
  updateLocalStorageCardGroup,
} from "@/functions/local-storage/card-local-storage";
import { currency, titleCase } from "@/functions/text-manipulation";
import { Card } from "@/models/card/card";
import {
  faCircleInfo,
  faClipboardList,
  faClipboardQuestion,
  faList,
  faListCheck,
  faMinus,
  faPlus,
  faRightFromBracket,
  faShop,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Linking, Pressable, View } from "react-native";
import Box from "../ui/box/box";
import Dropdown from "../ui/dropdown/dropdown";
import Select, { SelectOption } from "../ui/input/select";
import CardCost from "./card-cost";
import CardDetailedPreview from "./card-detailed-preview";
import CardImage from "./card-image";
import CardPrints from "./card-prints";
import CardText from "./card-text";

export interface CardItemProps {
  card: Card;
  groups?: string[];
  hideImage?: boolean;
}

export default function CardItem({
  card,
  groups,
  hideImage = false,
  itemsExpanded,
  setItemsExpanded,
}: CardItemProps & {
  itemsExpanded?: number;
  setItemsExpanded: Dispatch<SetStateAction<number>>;
}) {
  const { deck, format, commander, partner } = useContext(DeckContext);

  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);

  const [legal, setLegal] = useState(true);
  const [reasons, setReasons] = useState([] as string[]);
  const [restricted, setRestricted] = useState(false);

  let leftHover = false;

  useEffect(() => {
    if (!deck || !format) return;

    const { legal, reasons, restricted } = evaluateCardLegality(
      card,
      format,
      commander
        ? [...commander?.colorIdentity, ...(partner?.colorIdentity || [])]
        : undefined
    );

    setLegal(legal);
    setReasons(reasons);
    setRestricted(restricted);
  }, [deck, card, format, commander, partner]);

  useEffect(
    () => (itemsExpanded === 0 ? setExpanded(false) : undefined),
    [itemsExpanded]
  );

  return (
    <>
      <Pressable
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onPointerEnter={() => {
          leftHover = false;

          setTimeout(() => {
            if (!expanded && !hovered && !leftHover) setHovered(true);
          }, 500);
        }}
        onPointerLeave={() => {
          setHovered(false);
          leftHover = true;
        }}
        onPress={() => {
          if (expanded) setItemsExpanded((itemsExpanded || 0) - 1);
          else setItemsExpanded((itemsExpanded || 0) + 1);

          setExpanded(!expanded);
        }}
        className={`flex gap-2 overflow-hidden transition-all duration-300 outline-none ${
          expanded ? "max-h-[1000px] " : "max-h-[24px]"
        } ${expanded ? "bg-background-200 bg-opacity-1000" : "bg-none"}`}
      >
        <CardItemHeader
          card={card}
          focused={focused}
          legal={legal}
          restricted={restricted}
        />

        {expanded && (
          <>
            {!hideImage && (
              <>
                <View className={"flex gap-2 px-2"}>
                  <CardImage
                    card={card}
                    focusable={expanded}
                    onClick={() => setModalOpen(true)}
                  />
                </View>
              </>
            )}

            {reasons?.length > 0 && (
              <>
                <View className="flex mx-4">
                  <Text size="sm" weight="semi">
                    Legality Issues
                  </Text>

                  <CardText text={reasons.join("\n")} />
                </View>
                <Divider thick />
              </>
            )}

            <CardItemFooter
              card={card}
              groups={groups}
              expanded={expanded}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              itemsExpanded={itemsExpanded}
              setItemsExpanded={setItemsExpanded}
            />
          </>
        )}
      </Pressable>

      <Modal open={modalOpen} setOpen={setModalOpen}>
        <CardDetailedPreview hidePrices fullHeight card={card}>
          {reasons?.length > 0 && (
            <>
              <Divider thick />

              <View className="flex mx-4">
                <Text size="sm" weight="semi">
                  Legality Issues
                </Text>

                <CardText text={reasons.join("\n")} />
              </View>

              <Divider thick />
            </>
          )}

          <CardItemFooter
            card={card}
            groups={groups}
            expanded={expanded}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            itemsExpanded={itemsExpanded}
            setItemsExpanded={setItemsExpanded}
          />
        </CardDetailedPreview>
      </Modal>
    </>
  );
}

export function CardItemHeader({
  card,
  focused,
  legal,
  restricted,
}: CardItemProps & { focused: boolean; legal: boolean; restricted: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <View
      className={`flex flex-row justify-between gap-1 px-2 max-h-[24px] h-[24px] items-center transition-all ${
        hovered ? "bg-primary-300 bg-opacity-60" : "bg-none"
      }`}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <View className="flex flex-row gap-2 flex-1">
        <Text action={!legal ? "danger" : restricted ? "warning" : "default"}>
          {card.count}
        </Text>
        <Text
          className="truncate"
          action={!legal ? "danger" : restricted ? "warning" : "default"}
        >
          {card.name}
        </Text>
      </View>

      {card.faces ? (
        <Text className="flex flex-row items-center gap-1">
          {card.faces.front.manaCost && (
            <CardCost size="sm" cost={card.faces.front.manaCost} />
          )}

          {card.faces.back.manaCost && <Text className="h-[20px]"> // </Text>}

          {card.faces.back.manaCost && (
            <CardCost size="sm" cost={card.faces.back.manaCost} />
          )}
        </Text>
      ) : card.manaCost ? (
        <CardCost size="sm" cost={card.manaCost} />
      ) : null}
    </View>
  );
}

export function CardItemFooter({
  card,
  groups,
  expanded,
  modalOpen,
  setModalOpen,
  itemsExpanded,
  setItemsExpanded,
}: any) {
  const { addToast } = useContext(ToastContext);
  const { board } = useContext(BoardContext);
  const { setStoredCards } = useContext(StoredCardsContext);

  const [print, setPrint] = useState(undefined as Card | undefined);

  const [groupOptions, setGroupOptions] = useState([] as SelectOption[]);

  const [moveOpen, setMoveOpen] = useState(false);

  const sideboardCount = getLocalStorageStoredCards(BoardTypes.SIDE).reduce(
    (acc, storedCard) => acc + storedCard.count,
    0
  );

  useEffect(() => {
    if (!print) return;

    switchPrint(print);
  }, [print]);

  useEffect(() => {
    if (!groups?.length) return;

    setGroupOptions(
      groups.map((group: string) => ({ label: titleCase(group), value: group }))
    );
  }, [groups]);

  function setCardGroup(group: string) {
    updateLocalStorageCardGroup(card, group, board);
    setStoredCards(getLocalStorageStoredCards(board));
  }

  function addToCount() {
    addToLocalStorageCardCount(card, board);
    setStoredCards(getLocalStorageStoredCards(board));
  }

  function removeFromCount() {
    removeFromLocalStorageCardCount(card, board);
    setStoredCards(getLocalStorageStoredCards(board));
  }

  function removeCard() {
    if (expanded) setItemsExpanded((itemsExpanded || 0) - 1);

    removeLocalStorageCard(card, board);
    setStoredCards(getLocalStorageStoredCards(board));

    addToast({
      action: "danger",
      title: `Card Removed`,
      subtitle: `${card.name} has been removed from the ${board} board`,
    });
  }

  function switchPrint(print: Card) {
    switchLocalStorageCardPrint(card, print, board);
    setStoredCards(getLocalStorageStoredCards(board));
  }

  function moveCard(moveToBoard: BoardType, add?: boolean) {
    saveLocalStorageCard(card, card.count, moveToBoard);
    if (!add) removeLocalStorageCard(card, board);
    setStoredCards(getLocalStorageStoredCards(board));
    setMoveOpen(false);

    addToast({
      action: "info",
      title: `Card Moved`,
      subtitle: `${card.name} has been moved to the ${moveToBoard} board`,
    });
  }

  return (
    <View className="flex gap-2">
      {groups?.length > 0 && (
        <Pressable
          className="flex mx-2 bg-background-100 rounded-lg z-10"
          tabIndex={-1}
        >
          <Select
            value={card.group}
            placeholder="Group"
            options={groupOptions}
            maxHeight="!max-h-[128px]"
            onChange={(group) => setCardGroup(group)}
          />
        </Pressable>
      )}

      <View className="flex flex-row justify-center items-center gap-2 px-2">
        {setItemsExpanded && (
          <Button
            size="sm"
            action="info"
            type="outlined"
            className="flex-1"
            tabbable={expanded}
            icon={faCircleInfo}
            onClick={() => setModalOpen(!modalOpen)}
          />
        )}

        <CardPrints
          iconOnly
          card={card}
          setCard={setPrint}
          disabled={!expanded}
          tabbable={expanded}
        />

        <Button
          size="sm"
          type="outlined"
          action="warning"
          className="flex-1"
          tabbable={expanded}
          icon={faRightFromBracket}
          onClick={() => setMoveOpen(true)}
        />

        <View className="-mx-1">
          <Dropdown xOffset={-32} expanded={moveOpen} setExpanded={setMoveOpen}>
            <Box className="flex justify-start items-start !p-0 border-2 border-primary-300 !bg-background-100 !bg-opacity-90 overflow-hidden">
              {board !== BoardTypes.MAIN && (
                <Button
                  start
                  square
                  size="sm"
                  type="clear"
                  text="Main"
                  className="w-full"
                  icon={faList}
                  onClick={() => moveCard(BoardTypes.MAIN)}
                />
              )}

              {board !== BoardTypes.SIDE && (
                <Button
                  start
                  square
                  size="sm"
                  type="clear"
                  text="Side"
                  className="w-full"
                  icon={faClipboardList}
                  disabled={sideboardCount >= SideBoardLimit}
                  onClick={() => moveCard(BoardTypes.SIDE)}
                />
              )}

              {board !== BoardTypes.MAYBE && (
                <Button
                  start
                  square
                  size="sm"
                  type="clear"
                  text="Maybe"
                  className="w-full"
                  icon={faClipboardQuestion}
                  onClick={() => moveCard(BoardTypes.MAYBE)}
                />
              )}

              {board !== BoardTypes.ACQUIRE && (
                <>
                  <Button
                    start
                    square
                    size="sm"
                    type="clear"
                    text="Acquire"
                    className="w-full"
                    icon={faListCheck}
                    onClick={() => moveCard(BoardTypes.ACQUIRE)}
                  />

                  <Button
                    start
                    square
                    size="sm"
                    type="clear"
                    text="Acquire"
                    className="w-full"
                    icon={faPlus}
                    onClick={() => moveCard(BoardTypes.ACQUIRE, true)}
                  />
                </>
              )}
            </Box>
          </Dropdown>
        </View>

        <Button
          size="sm"
          type="outlined"
          action="danger"
          className="flex-1"
          icon={faTrash}
          tabbable={expanded}
          onClick={removeCard}
        ></Button>
      </View>

      <View className="flex flex-row justify-between items-center px-2">
        <Button
          squareRight
          size="sm"
          type="outlined"
          action="danger"
          className="flex-1"
          icon={faMinus}
          tabbable={expanded}
          onClick={() => removeFromCount()}
        />

        <View className="flex justify-center items-center px-4 h-full border-2 border-x-0 border-dark-500">
          <Text weight="bold">{card.count}</Text>
        </View>

        <Button
          squareLeft
          size="sm"
          type="outlined"
          action="info"
          className="flex-1"
          icon={faPlus}
          tabbable={expanded}
          disabled={
            board === BoardTypes.SIDE && sideboardCount >= SideBoardLimit
          }
          onClick={() => addToCount()}
        />
      </View>

      <View className="flex flex-row flex-1 gap-2 px-2 pb-2">
        <Button
          size="xs"
          action="info"
          type="outlined"
          className="flex-1"
          icon={faShop}
          tabbable={expanded}
          text={currency(card.prices?.usd)}
          onClick={async () => await Linking.openURL(card.priceUris.tcgplayer)}
        />

        <Button
          size="xs"
          action="info"
          type="outlined"
          className="flex-1"
          icon={faShop}
          tabbable={expanded}
          text={currency(card.prices?.eur)}
          onClick={async () => await Linking.openURL(card.priceUris.cardmarket)}
        />
      </View>
    </View>
  );
}
