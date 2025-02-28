import { getCardType } from "@/functions/cards/card-information";
import { titleCase } from "@/functions/text-manipulation";
import DeckService from "@/hooks/services/deck.service";
import { Card } from "@/models/card/card";
import { Deck } from "@/models/deck/deck";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { View } from "react-native";
import CardDetailedPreview from "../cards/card-detailed-preview";
import CardText from "../cards/card-text";
import Modal from "../ui/modal/modal";
import LoadingTable from "../ui/table/loading-table";
import Table from "../ui/table/table";
import Text from "../ui/text/text";

export interface KitModalProps {
  kit: Deck;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function KitModal({ kit, open, setOpen }: KitModalProps) {
  const [loading, setLoading] = useState(false);
  const [kitCards, setKitCards] = useState([] as Card[]);

  const [selectedCard, setSelectedCard] = useState(null as Card | null);
  const [cardPreviewModalOpen, setCardPreviewModalOpen] = useState(false);

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
