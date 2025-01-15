import { BoardTypes } from "@/constants/boards";
import {
  getLocalStorageStoredCards,
  saveLocalStorageCard,
  setLocalStorageCards,
} from "@/functions/local-storage/card-local-storage";
import { PaginationMeta } from "@/hooks/pagination";
import DeckService from "@/hooks/services/deck.service";
import { Card } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";
import { faChevronDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
import CardText from "../cards/card-text";
import Button from "../ui/button/button";
import Divider from "../ui/divider/divider";
import Input from "../ui/input/input";
import Modal from "../ui/modal/modal";
import Pagination from "../ui/pagination/pagination";
import Table, { TableColumn } from "../ui/table/table";
import Text from "../ui/text/text";
import DecksTable from "./decks-table";

export interface DeckKitProps {
  deck: Deck;
}

export default function DeckKits({ deck }: DeckKitProps) {
  const [open, setOpen] = React.useState(false);

  const [addKitModalOpen, setAddKitModalOpen] = React.useState(false);

  return (
    <View className="relative flex gap-2">
      <View className="sticky top-0 flex gap-2 bg-background-100 z-10">
        <Pressable
          className="flex flex-row justify-between items-center gap-4"
          onPress={() => setOpen(!open)}
        >
          <Text size="lg" thickness="bold">
            Kits
          </Text>

          <View className="flex flex-row gap-2">
            <Button
              text="Add Kit"
              type="clear"
              icon={faPlus}
              onClick={() => setAddKitModalOpen(true)}
            />

            <Button
              rounded
              type="clear"
              action="default"
              icon={faChevronDown}
              className={`${
                open ? "rotate-180" : ""
              } transition-all duration-300`}
              onClick={() => setOpen(!open)}
            />
          </View>
        </Pressable>

        <Divider thick className="!border-background-200 mb-2" />
      </View>

      <View
        className={`${
          open ? "max-h-[750px]" : "max-h-0"
        } overflow-hidden transition-all duration-300`}
      >
        {/* <Table  /> */}
      </View>

      <AddKitModal
        deck={deck}
        open={addKitModalOpen}
        setOpen={setAddKitModalOpen}
      />
    </View>
  );
}

interface KitModalProps {
  deck: Deck;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddKitModal({ deck, open, setOpen }: KitModalProps) {
  const [kits, setKits] = React.useState([] as Deck[]);
  const [selectedKit, setSelectedKit] = React.useState(null as Deck | null);

  const [page, setPage] = React.useState(1);
  const [meta, setMeta] = React.useState(null as PaginationMeta | null);

  const [search, setSearch] = React.useState("");
  const [userKits, setUserKits] = React.useState(false);

  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  useEffect(() => {
    if (!deck || !open) return;

    DeckService.getKits({ search, userKits }).then((response) => {
      setKits(response.data);
      setMeta(response.meta);
    });
  }, [deck, open, page, search, userKits]);

  function selectKit(kit: Deck) {
    if (!kit) return;

    DeckService.getKit(kit.id).then((response) => setSelectedKit(response));
  }

  function addKit() {
    if (!selectedKit) return;
    setSaving(true);

    selectedKit.main.forEach((card) => {
      saveLocalStorageCard(card, card.count, BoardTypes.MAIN);
    });

    setLocalStorageCards(getLocalStorageStoredCards(BoardTypes.MAIN));

    setTimeout(() => {
      setSuccess(true);
      setSaving(false);
    }, 500);

    setTimeout(() => {
      setSuccess(false);
      setOpen(false);
    }, 2000);
  }

  return (
    <Modal open={open} setOpen={setOpen}>
      <View className="flex gap-4 max-w-2xl max-h-[80vh]">
        <Text size="xl" thickness="bold">
          Add Kit
        </Text>
      </View>

      <Text>Select a kit to add to your deck</Text>

      <View className="flex flex-row gap-4 my-4">
        <Input
          lightBorder
          label="Search"
          placeholder="Search for a kit"
          onChange={setSearch}
        />

        <View className="flex flex-row self-end">
          <Button
            squareRight
            text="All Kits"
            type={!userKits ? "default" : "outlined"}
            onClick={() => setUserKits(false)}
          />
          <Button
            squareLeft
            text="Your Kits"
            type={userKits ? "default" : "outlined"}
            onClick={() => setUserKits(true)}
          />
        </View>
      </View>

      <DecksTable
        hideFormat
        hideModified
        hideFavorites
        hideViews
        lightBackground
        decks={kits}
        rowClick={selectKit}
      />

      {meta && <Pagination meta={meta} onChange={(page) => setPage(page)} />}

      {selectedKit && (
        <View className="flex gap-4 mt-4">
          <Text size="lg" thickness="bold">
            {selectedKit.name} Cards
          </Text>

          <Divider thick />

          <Table
            lightBackground
            className="max-h-[250px]"
            data={selectedKit.main}
            columns={
              [
                {
                  title: "Name",
                  row: (card) => <Text>{card.name}</Text>,
                },
                {
                  fit: true,
                  title: "Mana Cost",
                  row: (card) =>
                    card.manaCost && (
                      <View className="max-w-fit py-0.5 px-1 bg-background-100 rounded-full overflow-hidden">
                        <CardText text={card.manaCost} />
                      </View>
                    ),
                },
              ] as TableColumn<Card>[]
            }
          />

          <View className="flex flex-row justify-end">
            <Button
              icon={faPlus}
              disabled={!selectedKit || saving}
              action={success ? "success" : "primary"}
              text={saving ? "Saving..." : success ? "Kit Added!" : "Add Kit"}
              onClick={() => addKit()}
            />
          </View>
        </View>
      )}
    </Modal>
  );
}
