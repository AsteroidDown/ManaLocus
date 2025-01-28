import CardImportExportModal from "@/components/cards/card-import-export-modal";
import CardSearch from "@/components/cards/card-search";
import Button from "@/components/ui/button/button";
import { TabProps } from "@/components/ui/tabs/tab";
import TabBar from "@/components/ui/tabs/tab-bar";
import { Tooltip } from "@/components/ui/tooltip/tooltip";
import { BoardType, BoardTypes } from "@/constants/boards";
import BoardContext from "@/contexts/cards/board.context";
import BuilderPreferencesContext from "@/contexts/cards/builder-preferences.context";
import StoredCardsContext from "@/contexts/cards/stored-cards.context";
import DeckContext from "@/contexts/deck/deck.context";
import BodyHeightContext from "@/contexts/ui/body-height.context";
import BuilderHeightContext from "@/contexts/ui/builder-height.context";
import {
  getLocalStorageBuilderPreferences,
  setLocalStorageBuilderPreferences,
} from "@/functions/local-storage/builder-preferences-local-storage";
import { getLocalStorageStoredCards } from "@/functions/local-storage/card-local-storage";
import {
  faBars,
  faEye,
  faEyeSlash,
  faFileArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";

export default function CardsLayout() {
  const { deck } = useContext(DeckContext);

  if (!deck) return;

  const { bodyHeight } = useContext(BodyHeightContext);
  const { builderHeight, setBuilderHeight } = useContext(BuilderHeightContext);
  const { setStoredCards } = useContext(StoredCardsContext);
  const { setPreferences } = useContext(BuilderPreferencesContext);

  const containerRef = React.useRef<View>(null);

  const [board, setBoard] = React.useState(BoardTypes.MAYBE as BoardType);

  const [open, setOpen] = React.useState(false);

  const [groupMulticolored, setGroupMulticolored] = React.useState(false);
  const [hideImages, setHideImages] = React.useState(false);

  const tabs: TabProps[] = [
    {
      title: "Mana Value",
      link: `decks/${deck.id}/builder/maybe-board`,
      name: "cost",
    },
    {
      title: "Color",
      link: `decks/${deck.id}/builder/maybe-board/color`,
      name: "color",
    },
    {
      title: "Type",
      link: `decks/${deck.id}/builder/maybe-board/type`,
      name: "type",
    },
  ];

  useEffect(() => {
    setStoredCards(getLocalStorageStoredCards(board));

    const storedPreferences = getLocalStorageBuilderPreferences();
    if (storedPreferences) setPreferences(storedPreferences);

    if (storedPreferences?.groupMulticolored) setGroupMulticolored(true);
    else setGroupMulticolored(false);

    if (storedPreferences?.hideCardImages) setHideImages(true);
    else setHideImages(false);
  }, []);

  function groupMulticoloredCards() {
    setGroupMulticolored(true);
    setLocalStorageBuilderPreferences({ groupMulticolored: true });
    setPreferences(getLocalStorageBuilderPreferences() || {});
  }

  function ungroupMulticoloredCards() {
    setGroupMulticolored(false);
    setLocalStorageBuilderPreferences({ groupMulticolored: false });
    setPreferences(getLocalStorageBuilderPreferences() || {});
  }

  function hideCardImages() {
    setHideImages(true);
    setLocalStorageBuilderPreferences({ hideCardImages: true });
    setPreferences(getLocalStorageBuilderPreferences() || {});
  }

  function showCardImages() {
    setHideImages(false);
    setLocalStorageBuilderPreferences({ hideCardImages: false });
    setPreferences(getLocalStorageBuilderPreferences() || {});
  }

  return (
    <BoardContext.Provider value={{ board, setBoard }}>
      <View
        ref={containerRef}
        style={{ minHeight: bodyHeight + 24 }}
        className="flex gap-4 px-6 py-4 w-full min-h-fit pb-4 bg-background-100"
        onLayout={() => {
          if (builderHeight) return;

          containerRef.current?.measureInWindow((_x, _y, _width, height) =>
            setBuilderHeight(Math.min(height, 518))
          );
        }}
      >
        <CardSearch />
        <TabBar tabs={tabs} className="z-[-1]">
          <View className="flex flex-row gap-2 mx-4">
            <Button
              rounded
              type="clear"
              icon={faFileArrowDown}
              onClick={() => setOpen(!open)}
            />

            <Tooltip title="Group Multicolored Cards">
              <Button
                rounded
                icon={faBars}
                type={`${groupMulticolored ? "outlined" : "clear"}`}
                onClick={() =>
                  groupMulticolored
                    ? ungroupMulticoloredCards()
                    : groupMulticoloredCards()
                }
              />
            </Tooltip>

            <Tooltip
              title={hideImages ? "Show Card Images" : "Hide Card Images"}
            >
              <Button
                rounded
                type={hideImages ? "outlined" : "clear"}
                icon={hideImages ? faEyeSlash : faEye}
                onClick={() =>
                  hideImages ? showCardImages() : hideCardImages()
                }
              />
            </Tooltip>
          </View>
        </TabBar>
      </View>

      <CardImportExportModal open={open} setOpen={setOpen} />
    </BoardContext.Provider>
  );
}
