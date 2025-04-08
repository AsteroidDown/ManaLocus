import { BoardTypes } from "@/constants/boards";
import StoredCardsContext from "@/contexts/cards/stored-cards.context";
import ToastContext from "@/contexts/ui/toast.context";
import { getCardType } from "@/functions/cards/card-information";
import {
  getLocalStorageStoredCards,
  saveLocalStorageCard,
} from "@/functions/local-storage/card-local-storage";
import { addLocalStorageKit } from "@/functions/local-storage/kits-local-storage";
import { titleCase } from "@/functions/text-manipulation";
import { PaginationMeta } from "@/hooks/pagination";
import DeckService from "@/hooks/services/deck.service";
import { Card } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";
import { faChevronLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Pressable, useWindowDimensions, View } from "react-native";
import CardDetailedPreview from "../cards/card-detailed-preview";
import CardText from "../cards/card-text";
import DecksTable from "../decks/decks-table";
import Button from "../ui/button/button";
import Input from "../ui/input/input";
import Modal from "../ui/modal/modal";
import Pagination from "../ui/pagination/pagination";
import Table, { TableColumn } from "../ui/table/table";
import Text from "../ui/text/text";

export interface AddKitModalProps {
  deck: Deck;
  deckKits: Deck[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setKitIndex: Dispatch<SetStateAction<number>>;
}

export default function AddKitModal({
  deck,
  deckKits,
  open,
  setOpen,
  setKitIndex,
}: AddKitModalProps) {
  const { addToast } = useContext(ToastContext);
  const { setStoredCards } = useContext(StoredCardsContext);

  const width = useWindowDimensions().width;

  const [kits, setKits] = useState([] as Deck[]);
  const [selectedKit, setSelectedKit] = useState(null as Deck | null);

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null as PaginationMeta | null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [userKits, setUserKits] = useState(false);

  const [saving, setSaving] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null as Card | null);
  const [cardPreviewModalOpen, setCardPreviewModalOpen] = useState(false);

  useEffect(() => {
    if (!deck || !open) return;
    setLoading(true);

    DeckService.getMany({
      search,
      onlyKits: true,
      userDecks: userKits,
      excludeIds: deckKits?.map((kit) => kit.id),
    }).then((response) => {
      setLoading(false);
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
    setOpen(false);
    setSelectedKit(null);

    addToast({
      action: "success",
      title: `${selectedKit.name} Added!`,
      subtitle: `${selectedKit.name} has been added to ${deck.name}`,
    });
  }

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Add Kit"
      subtitle="Select a kit to add to your deck"
    >
      <View className="flex flex-row gap-8 max-w-full">
        <View
          className={`flex lg:gap-4 min-w-full max-w-full transition-all duration-300 ${
            selectedKit ? "-ml-[calc(100%+36px)]" : ""
          }`}
        >
          <View className="flex lg:flex-row flex-col-reverse flex-wrap gap-4 my-4">
            <Input
              label="Search"
              placeholder="Search for a kit"
              onChange={setSearch}
            />

            <View className="flex flex-row lg:self-end">
              <Button
                size="sm"
                squareRight
                text="All Kits"
                className="flex-1"
                type={!userKits ? "default" : "outlined"}
                onClick={() => setUserKits(false)}
              />
              <Button
                size="sm"
                squareLeft
                text="Your Kits"
                className="flex-1"
                type={userKits ? "default" : "outlined"}
                onClick={() => setUserKits(true)}
              />
            </View>
          </View>

          {kits?.length > 0 && (
            <>
              <DecksTable
                hideViews
                hideFormat
                hideModified
                hideFavorites
                decks={kits}
                rowClick={selectKit}
                hideCreator={width <= 600}
              />

              {meta && (
                <Pagination meta={meta} onChange={(page) => setPage(page)} />
              )}
            </>
          )}
        </View>

        <View className="flex flex-col gap-4 min-w-full">
          <Pressable
            className="flex flex-row items-center mt-2"
            onPress={() => setSelectedKit(null)}
          >
            <Button
              type="clear"
              action="default"
              buttonClasses="gap-2"
              icon={faChevronLeft}
              onClick={() => setSelectedKit(null)}
            />

            <Text size="xl" weight="bold">
              {selectedKit?.name} Cards
            </Text>
          </Pressable>

          <Table
            loading={loading}
            className="max-h-[250px] -mt-4"
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
                ...(width > 600
                  ? ([
                      {
                        fit: true,
                        title: "Type",
                        row: (card) => (
                          <Text>{titleCase(getCardType(card))}</Text>
                        ),
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
                    ] as TableColumn<Card>[])
                  : []),
              ] as TableColumn<Card>[]
            }
          />

          <View className="flex flex-row justify-end">
            <Button
              size="sm"
              type="outlined"
              icon={faPlus}
              disabled={!selectedKit || saving}
              text={saving ? "Adding..." : "Add Kit"}
              onClick={addKit}
            />
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
