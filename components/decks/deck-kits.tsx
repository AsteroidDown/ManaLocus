import { BoardTypes } from "@/constants/boards";
import StoredCardsContext from "@/contexts/cards/stored-cards.context";
import { getCardType } from "@/functions/cards/card-information";
import {
  getLocalStorageStoredCards,
  removeLocalStorageCard,
  saveLocalStorageCard,
} from "@/functions/local-storage/card-local-storage";
import {
  addLocalStorageKit,
  getLocalStorageKits,
  removeLocalStorageKit,
  setLocalStorageKits,
} from "@/functions/local-storage/kits-local-storage";
import { titleCase } from "@/functions/text-manipulation";
import { PaginationMeta } from "@/hooks/pagination";
import DeckService from "@/hooks/services/deck.service";
import { Card } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";
import {
  faChevronLeft,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import CardDetailedPreview from "../cards/card-detailed-preview";
import CardText from "../cards/card-text";
import Button from "../ui/button/button";
import Checkbox from "../ui/checkbox/checkbox";
import Divider from "../ui/divider/divider";
import Input from "../ui/input/input";
import Modal from "../ui/modal/modal";
import Pagination from "../ui/pagination/pagination";
import LoadingTable from "../ui/table/loading-table";
import Table, { TableColumn } from "../ui/table/table";
import Text from "../ui/text/text";
import DecksTable from "./decks-table";

export interface DeckKitProps {
  deck: Deck;

  readonly?: boolean;
}

export default function DeckKits({ deck, readonly }: DeckKitProps) {
  const [deckKits, setDeckKits] = React.useState([] as Deck[]);

  const [loading, setLoading] = React.useState(false);

  const [selectedKit, setSelectedKit] = React.useState(null as Deck | null);
  const [kitModalOpen, setKitModalOpen] = React.useState(false);
  const [addKitModalOpen, setAddKitModalOpen] = React.useState(false);

  const [kitIndex, setKitIndex] = React.useState(0);

  useEffect(() => {
    if (!deck) return;
    setLoading(true);

    DeckService.getDeckKits(deck.id).then((deckKits) => {
      setDeckKits(deckKits);
      setLoading(false);

      if (!readonly) {
        setLocalStorageKits(deckKits);
        setKitIndex(-1);
      }
    });
  }, [deck]);

  useEffect(() => {
    setDeckKits(getLocalStorageKits());
  }, [kitIndex]);

  if (readonly && !deckKits?.length) return null;

  return (
    <View className="flex">
      <View className="flex flex-row justify-between items-center gap-4">
        <Text size="lg" thickness="bold">
          {readonly ? "Kits in Deck" : "Kits"}
        </Text>

        {!readonly && (
          <Button
            text="Add Kit"
            type="clear"
            icon={faPlus}
            onClick={() => setAddKitModalOpen(true)}
          />
        )}
      </View>

      <Divider
        thick
        className={`${readonly ? "my-4" : ""} !border-background-200`}
      />

      <View>
        {deckKits?.length > 0 && (
          <DecksTable
            hideModified
            hideFavorites
            hideViews
            decks={deckKits}
            loading={loading}
            hideHeader={!readonly}
            rowClick={(kit) => {
              setSelectedKit(kit);
              setKitModalOpen(true);
            }}
            endColumns={
              !readonly
                ? [
                    {
                      fit: true,
                      row: (kit) => (
                        <RemoveKitModal
                          kit={kit}
                          deckKits={deckKits}
                          setKitIndex={setKitIndex}
                        />
                      ),
                    },
                  ]
                : []
            }
          />
        )}
      </View>

      {selectedKit && (
        <KitModal
          kit={selectedKit}
          open={kitModalOpen}
          setOpen={setKitModalOpen}
        />
      )}

      <AddKitModal
        deck={deck}
        deckKits={deckKits}
        open={addKitModalOpen}
        setOpen={setAddKitModalOpen}
        setKitIndex={setKitIndex}
      />
    </View>
  );
}

interface KitModalProps {
  kit: Deck;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function KitModal({ kit, open, setOpen }: KitModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [kitCards, setKitCards] = React.useState([] as Card[]);

  const [selectedCard, setSelectedCard] = React.useState(null as Card | null);
  const [cardPreviewModalOpen, setCardPreviewModalOpen] = React.useState(false);

  useEffect(() => {
    if (!kit) return;
    setLoading(true);

    DeckService.get(kit.id).then((foundKit) => {
      setKitCards(foundKit.main.sort((a, b) => a.name.localeCompare(b.name)));
      setLoading(false);
    });
  }, [kit]);

  useEffect(() => {
    if (!selectedCard) return;
    setCardPreviewModalOpen(true);
  }, [selectedCard]);

  return (
    <Modal open={open} setOpen={setOpen}>
      <View className="flex gap-4 min-w-[400px] max-w-2xl max-h-[80vh]">
        <Text size="xl" thickness="bold">
          {kit.name}
        </Text>

        {loading ? (
          <LoadingTable />
        ) : (
          <Table
            className="max-h-[500px]"
            data={kitCards}
            rowClick={(card) => setSelectedCard(card)}
            columns={[
              {
                fit: true,
                row: (card) => <Text>{card.count}</Text>,
              },
              {
                title: "Name",
                row: (card) => <Text>{card.name}</Text>,
              },
              {
                fit: true,
                title: "Type",
                row: (card) => <Text>{titleCase(getCardType(card))}</Text>,
              },
              {
                fit: true,
                center: true,
                title: "Mana Cost",
                row: (card) =>
                  card.manaCost && (
                    <View className="max-w-fit py-0.5 px-1 bg-background-100 rounded-full overflow-hidden">
                      <CardText text={card.manaCost} />
                    </View>
                  ),
              },
            ]}
          />
        )}
      </View>

      {selectedCard && (
        <Modal open={cardPreviewModalOpen} setOpen={setCardPreviewModalOpen}>
          <CardDetailedPreview
            link
            fullHeight
            onLinkPress={() => setOpen(false)}
            card={selectedCard}
          />
        </Modal>
      )}
    </Modal>
  );
}
interface AddKitModalProps {
  deck: Deck;
  deckKits: Deck[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setKitIndex: React.Dispatch<React.SetStateAction<number>>;
}

function AddKitModal({
  deck,
  deckKits,
  open,
  setOpen,
  setKitIndex,
}: AddKitModalProps) {
  const { setStoredCards } = useContext(StoredCardsContext);

  const [kits, setKits] = React.useState([] as Deck[]);
  const [selectedKit, setSelectedKit] = React.useState(null as Deck | null);

  const [page, setPage] = React.useState(1);
  const [meta, setMeta] = React.useState(null as PaginationMeta | null);

  const [search, setSearch] = React.useState("");
  const [userKits, setUserKits] = React.useState(false);

  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState(null as Card | null);
  const [cardPreviewModalOpen, setCardPreviewModalOpen] = React.useState(false);

  useEffect(() => {
    if (!deck || !open) return;

    DeckService.getMany({
      search,
      onlyKits: true,
      userDecks: userKits,
      excludeIds: deckKits?.map((kit) => kit.id),
    }).then((response) => {
      setKits(response.data);
      setMeta(response.meta);
    });
  }, [deck, open, page, search, userKits]);

  useEffect(() => {
    if (!selectedCard) return;
    setCardPreviewModalOpen(true);
  }, [selectedCard]);

  function selectKit(kit: Deck) {
    if (!kit) return;

    DeckService.get(kit.id).then((response) => setSelectedKit(response));
  }

  function addKit() {
    if (!selectedKit) return;
    setSaving(true);

    setKitIndex(deckKits.length + 1);

    addLocalStorageKit(selectedKit);

    selectedKit.main.forEach((card) => {
      saveLocalStorageCard(card, card.count, BoardTypes.MAIN);
    });

    const mainCards = getLocalStorageStoredCards(BoardTypes.MAIN);
    setStoredCards(mainCards);

    setSaving(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      setOpen(false);
      setSelectedKit(null);
    }, 2000);
  }

  return (
    <Modal open={open} setOpen={setOpen}>
      <View className="flex gap-4 max-w-2xl max-h-[80vh]">
        <View className="flex flex-row gap-8 max-w-[416px]">
          <View
            className={`flex gap-4 ${
              selectedKit ? "-ml-[450px]" : ""
            } transition-all duration-300`}
          >
            <Text size="xl" thickness="bold">
              Add Kit
            </Text>

            <Text>Select a kit to add to your deck</Text>

            <View className="flex flex-row gap-4 my-4">
              <Input
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

            {kits?.length > 0 && (
              <>
                <DecksTable
                  hideFormat
                  hideModified
                  hideFavorites
                  hideViews
                  decks={kits}
                  rowClick={selectKit}
                />

                {meta && (
                  <Pagination meta={meta} onChange={(page) => setPage(page)} />
                )}
              </>
            )}
          </View>

          <View className="flex flex-col gap-4">
            <View className="flex flex-row gap-2 items-center -ml-2">
              <Button
                rounded
                type="clear"
                action="default"
                icon={faChevronLeft}
                onClick={() => setSelectedKit(null)}
              />

              <Text size="xl" thickness="bold">
                {selectedKit?.name} Cards
              </Text>
            </View>

            <Table
              className="max-h-[250px]"
              data={selectedKit?.main || []}
              rowClick={(card) => setSelectedCard(card)}
              columns={
                [
                  {
                    fit: true,
                    row: (card) => <Text>{card.count}</Text>,
                  },
                  {
                    title: "Name",
                    row: (card) => <Text>{card.name}</Text>,
                  },
                  {
                    fit: true,
                    title: "Type",
                    row: (card) => <Text>{titleCase(getCardType(card))}</Text>,
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
                onClick={addKit}
              />
            </View>
          </View>
        </View>
      </View>

      {selectedCard && (
        <Modal open={cardPreviewModalOpen} setOpen={setCardPreviewModalOpen}>
          <CardDetailedPreview
            link
            fullHeight
            onLinkPress={() => setOpen(false)}
            card={selectedCard}
          />
        </Modal>
      )}
    </Modal>
  );
}

interface RemoveKitModalProps {
  kit: Deck;
  deckKits: Deck[];
  setKitIndex: React.Dispatch<React.SetStateAction<number>>;
}

function RemoveKitModal({ kit, deckKits, setKitIndex }: RemoveKitModalProps) {
  const { setStoredCards } = useContext(StoredCardsContext);

  const [open, setOpen] = React.useState(false);

  const [removeCards, setRemoveCards] = React.useState(false);

  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  async function removeKit() {
    if (!kit) return;

    setSaving(true);

    const kitIndex = deckKits.findIndex((deckKit) => deckKit.id === kit.id);
    if (kitIndex < 0) return;

    if (removeCards) {
      await DeckService.get(kit.id).then((response) => {
        response.main.forEach((card) => {
          removeLocalStorageCard(card, BoardTypes.MAIN);
        });

        const mainCards = getLocalStorageStoredCards(BoardTypes.MAIN);
        setStoredCards(mainCards);
      });
    }

    removeLocalStorageKit(kit);

    setSaving(false);
    setSuccess(true);

    setTimeout(() => {
      setKitIndex(kitIndex);
      setSuccess(false);
      setOpen(false);
      setRemoveCards(false);
    }, 2000);
  }

  return (
    <View className="border-l -mr-4 border-background-300">
      <Button
        square
        type="clear"
        icon={faTrash}
        onClick={() => setOpen(true)}
      />

      <Modal open={open} setOpen={setOpen}>
        <View className="flex gap-4 max-w-2xl max-h-[80vh]">
          <Text size="xl" thickness="bold">
            Remove {kit.name}
          </Text>

          <Text>
            Are you sure you want to remove this kit from your deck? This action
            cannot be undone.
          </Text>

          <View className="flex flex-row justify-between items-center gap-4">
            <Checkbox
              size="sm"
              label="Remove kit cards from deck as well"
              checked={removeCards}
              onChange={setRemoveCards}
            />

            <View className="flex flex-row gap-2 items-center">
              <Button
                type="outlined"
                text="Cancel"
                onClick={() => setOpen(false)}
              />

              <Button
                disabled={saving}
                action={success ? "success" : "primary"}
                text={
                  saving ? "Removing..." : success ? "Kit Removed" : "Remove"
                }
                onClick={removeKit}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
