import { currency } from "@/functions/text-manipulation";
import ScryfallService from "@/hooks/services/scryfall.service";
import { Card } from "@/models/card/card";
import { TradeCardDTO } from "@/models/trade/dtos/trade.dto";
import { TradeCard } from "@/models/trade/trade";
import {
  faMinus,
  faPlus,
  faUpRightFromSquare,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Image, Pressable, useWindowDimensions, View } from "react-native";
import CardDetailedPreview from "../cards/card-detailed-preview";
import Button from "../ui/button/button";
import Checkbox from "../ui/checkbox/checkbox";
import Input from "../ui/input/input";
import NumberInput from "../ui/input/number-input";
import Select from "../ui/input/select";
import Modal from "../ui/modal/modal";
import Skeleton from "../ui/skeleton/skeleton";
import Text from "../ui/text/text";

export interface TradeCardProps {
  tradeCard: TradeCard | TradeCardDTO;

  zIndex?: number;
  readonly?: boolean;

  onChange?: (tradeCard: TradeCard | TradeCardDTO) => void;
  onDelete?: (tradeCard: TradeCard | TradeCardDTO) => void;
}

export default function TradeCardDetails({
  tradeCard,
  zIndex,
  readonly,
  onChange,
  onDelete,
}: TradeCardProps) {
  const width = useWindowDimensions().width;

  const [foil, setFoil] = useState(false);
  const [print, setPrint] = useState(tradeCard.card);
  const [prints, setPrints] = useState([] as Card[]);
  const [price, setPrice] = useState(tradeCard.price);
  const [count, setCount] = useState(1);
  const [name, setName] = useState(tradeCard.name ?? "");

  const [open, setOpen] = useState(false);

  const imageUri = tradeCard.card?.faces
    ? tradeCard.card.faces.front.imageUris.png
    : tradeCard.card?.imageURIs?.png;

  const cardIsItem = !tradeCard.card && tradeCard.name !== undefined;

  useEffect(() => {
    if (!print || prints.length) return;

    ScryfallService.getCardPrints(print.name).then((prints) => {
      setPrints(prints);
      setPrint(
        prints.find((print) => print.scryfallId === tradeCard.card?.scryfallId)
      );
    });
  }, [readonly]);

  useEffect(() => {
    if (
      !print ||
      (tradeCard && print && tradeCard.card?.scryfallId === print.scryfallId)
    ) {
      return;
    }

    tradeCard.card = print;
    tradeCard.scryfallId = print.scryfallId;
    tradeCard.price = (print.prices?.usd || 0) * 100;
    onChange?.(tradeCard);
    setPrice((print.prices?.usd || 0) * 100);
  }, [print]);

  useEffect(() => {
    if (foil !== tradeCard.foil) tradeCard.foil = foil;
    if (price !== tradeCard.price) tradeCard.price = price;
    if (count !== tradeCard.count) tradeCard.count = count;
    if (name !== tradeCard.name) tradeCard.name = name;

    onChange?.(tradeCard);
  }, [foil, price, count, name]);

  return (
    <View
      className="flex lg:flex-row gap-4 bg-dark-100 bg-opacity-30 border-background-200 border-2 rounded-lg px-4 py-2"
      style={{ zIndex: zIndex ?? 0 }}
    >
      {!cardIsItem && width > 600 && (
        <View className="flex justify-center">
          {imageUri ? (
            <Pressable onPress={() => setOpen(true)}>
              <Image
                className="min-w-28 max-w-32 aspect-[2.5/3.5]"
                source={{
                  uri: imageUri,
                }}
              />
            </Pressable>
          ) : (
            <Skeleton className="min-w-28 max-w-32 aspect-[2.5/3.5]" />
          )}
        </View>
      )}

      <View className="flex-1 flex flex-col gap-2">
        <View
          className={`flex flex-row justify-between items-center gap-2 ${
            cardIsItem && !readonly ? "gap-2 -mx-2" : "max-h-8"
          }`}
        >
          {!cardIsItem && width < 600 && (
            <Button
              size="sm"
              rounded
              type="clear"
              action="default"
              className="-mx-2"
              icon={faUpRightFromSquare}
              onClick={() => setOpen(true)}
            />
          )}

          {tradeCard.card ? (
            <Pressable className="flex-1" onPress={() => setOpen(true)}>
              <Text truncate size="md" weight="medium">
                {readonly && `${tradeCard.count}  `}
                {tradeCard.card?.name}
              </Text>
            </Pressable>
          ) : cardIsItem ? (
            readonly ? (
              <Text truncate size="md" weight="medium">
                {tradeCard.name}
              </Text>
            ) : (
              <View className="flex-1 flex flex-row items-center gap-2 pl-2">
                <Text weight="medium" className="min-w-fit">
                  Name
                </Text>

                <Input
                  value={tradeCard.name}
                  onChange={setName}
                  placeholder="Name the Trade Item"
                />
              </View>
            )
          ) : (
            <Skeleton className="flex-1 h-8 w-[80%]" />
          )}

          {!readonly && (
            <Button
              rounded
              size="sm"
              icon={faX}
              type="clear"
              action="default"
              className={!cardIsItem ? "-mx-2" : ""}
              onClick={() => onDelete?.(tradeCard)}
            />
          )}
        </View>

        <View className="flex flex-row gap-4">
          {!cardIsItem && width <= 600 && (
            <View className="flex justify-center">
              {imageUri ? (
                <Pressable onPress={() => setOpen(true)}>
                  <Image
                    className="min-w-20 max-w-20 aspect-[2.5/3.5]"
                    source={{
                      uri: imageUri,
                    }}
                  />
                </Pressable>
              ) : (
                <Skeleton className="min-w-28 max-w-32 aspect-[2.5/3.5]" />
              )}
            </View>
          )}

          <View className="flex-1 flex flex-col gap-2">
            {!cardIsItem && (
              <View className="flex flex-row items-center gap-2 z-[12]">
                {print !== undefined && (
                  <Text weight="medium" className="min-w-10">
                    Print
                  </Text>
                )}

                {print !== undefined ? (
                  readonly ? (
                    <Text size="md" weight="medium">
                      {`${print.set.toUpperCase()} ${print.collectorNumber}`}
                    </Text>
                  ) : (
                    <Select
                      value={print}
                      onChange={setPrint}
                      options={prints.map((print) => ({
                        value: print,
                        label: `${print.set.toUpperCase()} ${
                          print.collectorNumber
                        }`,
                      }))}
                    />
                  )
                ) : (
                  <Skeleton className="flex-1 h-10" />
                )}
              </View>
            )}

            {price !== undefined && (
              <View className="flex flex-row items-center gap-2 z-[10]">
                {price !== undefined && (
                  <Text weight="medium" className="min-w-10">
                    Price
                  </Text>
                )}

                {readonly ? (
                  <Text size="md" weight="medium">
                    {currency((price || 0) / 100)}
                  </Text>
                ) : price !== undefined ? (
                  <NumberInput
                    currency
                    value={price}
                    inputClasses="max-w-[176px]"
                    onChange={(change) => setPrice(change ? Number(change) : 0)}
                  />
                ) : (
                  <Skeleton className="flex-1 h-10" />
                )}
              </View>
            )}

            {!cardIsItem && (
              <View className="flex flex-row justify-end items-center gap-4">
                <>
                  {print !== undefined ? (
                    readonly ? (
                      <Text weight="semi" className="mr-auto">
                        {tradeCard.foil ? "Foil" : "Non-Foil"}
                      </Text>
                    ) : (
                      <Checkbox
                        label="Foil"
                        checked={foil}
                        onChange={setFoil}
                        disabled={readonly}
                        className="!flex-row-reverse gap-[20px] !max-w-fit mr-auto"
                      />
                    )
                  ) : (
                    <Skeleton className="w-24 h-10 mr-auto" />
                  )}
                </>

                {tradeCard.card ? (
                  <>
                    {!readonly && (
                      <View className="flex flex-row">
                        <Button
                          size="sm"
                          squareRight
                          icon={faMinus}
                          action="info"
                          type="outlined"
                          onClick={() =>
                            setCount((count || 0) <= 1 ? 1 : (count || 0) - 1)
                          }
                        />

                        <View className="flex justify-center items-center w-8 h-8 border-2 border-dark-300">
                          <Text>{count}</Text>
                        </View>

                        <Button
                          size="sm"
                          squareLeft
                          icon={faPlus}
                          action="danger"
                          type="outlined"
                          onClick={() => setCount((count || 0) + 1)}
                        />
                      </View>
                    )}
                  </>
                ) : (
                  <Skeleton className="w-36 h-10" />
                )}
              </View>
            )}
          </View>
        </View>
      </View>

      <View className="-my-2 -mx-2">
        {tradeCard.card && (
          <Modal title={tradeCard.card.name} open={open} setOpen={setOpen}>
            <CardDetailedPreview
              fullHeight
              onLinkPress={() => setOpen(false)}
              card={tradeCard.card}
            />
          </Modal>
        )}
      </View>
    </View>
  );
}
