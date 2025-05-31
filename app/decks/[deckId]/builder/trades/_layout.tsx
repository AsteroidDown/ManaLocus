import CardImportExportModal from "@/components/cards/card-import-export-modal";
import CardSearch from "@/components/cards/card-search";
import Button from "@/components/ui/button/button";
import { TabProps } from "@/components/ui/tabs/tab";
import TabBar from "@/components/ui/tabs/tab-bar";
import Tooltip from "@/components/ui/tooltip/tooltip";
import { BoardType } from "@/constants/boards";
import BoardContext from "@/contexts/cards/board.context";
import BuilderPreferencesContext from "@/contexts/cards/builder-preferences.context";
import StoredCardsContext from "@/contexts/cards/stored-cards.context";
import DeckContext from "@/contexts/deck/deck.context";
import {
  getLocalStorageBuilderPreferences,
  setLocalStorageBuilderPreferences,
} from "@/functions/local-storage/builder-preferences-local-storage";
import { getLocalStorageStoredCards } from "@/functions/local-storage/card-local-storage";
import {
  faEye,
  faEyeSlash,
  faFileArrowDown,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";

export default function AcquireBoardLayout() {
  const { deck } = useContext(DeckContext);

  if (!deck) return;

  const { setStoredCards } = useContext(StoredCardsContext);
  const { setPreferences } = useContext(BuilderPreferencesContext);

  const [board, setBoard] = useState("trade" as BoardType);

  const [open, setOpen] = useState(false);

  const [groupMulticolored, setGroupMulticolored] = useState(false);
  const [hideImages, setHideImages] = useState(false);

  const tabs: TabProps[] = [
    {
      title: "Mana Value",
      link: `decks/${deck.id}/builder/trades`,
      name: "cost",
    },
    {
      title: "Color",
      link: `decks/${deck.id}/builder/trades/color`,
      name: "color",
    },
    {
      title: "Type",
      link: `decks/${deck.id}/builder/trades/type`,
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
      <View className="flex gap-4 py-4 w-full min-h-fit pb-4 bg-background-100">
        <CardSearch className="lg:px-6 px-4" />

        <TabBar tabs={tabs} className="z-[-1]" containerClasses="lg:px-6 px-4">
          <View className="flex flex-row">
            <Button
              size="sm"
              type="clear"
              icon={faFileArrowDown}
              onClick={() => setOpen(!open)}
            />

            <Tooltip text="Group Multicolored Cards">
              <Button
                size="sm"
                icon={faPalette}
                type={`${groupMulticolored ? "outlined" : "clear"}`}
                onClick={() =>
                  groupMulticolored
                    ? ungroupMulticoloredCards()
                    : groupMulticoloredCards()
                }
              />
            </Tooltip>

            <Tooltip
              text={hideImages ? "Show Card Images" : "Hide Card Images"}
            >
              <Button
                size="sm"
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
