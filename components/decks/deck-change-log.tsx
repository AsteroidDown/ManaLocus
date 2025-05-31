import { BoardType, BoardTypes } from "@/constants/boards";
import { titleCase } from "@/functions/text-manipulation";
import DeckService from "@/hooks/services/deck.service";
import { Deck } from "@/models/deck/deck";
import { DeckCardChange, DeckChange } from "@/models/deck/deck-change";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import React, { useEffect } from "react";
import { Pressable, View, ViewProps } from "react-native";
import Divider from "../ui/divider/divider";
import Icon from "../ui/icon/icon";
import TabBar from "../ui/tabs/tab-bar";
import Text from "../ui/text/text";

export interface DeckChangeTime {
  time: Date;
  added: number;
  removed: number;
  changes: DeckCardChange[];
}

export type DeckChangeLogProps = ViewProps & {
  deck: Deck;
};

export default function DeckChangeLog({ deck, className }: DeckChangeLogProps) {
  const [changes, setChanges] = React.useState(null as DeckChange | null);

  const [boardChanges, setBoardChanges] = React.useState(
    [] as DeckChangeTime[][]
  );

  const [openIndex, setOpenIndex] = React.useState(-1);

  useEffect(() => {
    if (!deck) return;

    DeckService.getChanges(deck.id).then((changes) => setChanges(changes));
  }, [deck]);

  useEffect(() => {
    if (!deck || !changes) return;

    setBoardChanges(
      (deck?.isCollection
        ? [BoardTypes.MAIN, "trade" as BoardType, BoardTypes.ACQUIRE]
        : [
            BoardTypes.MAIN,
            BoardTypes.SIDE,
            BoardTypes.MAYBE,
            BoardTypes.ACQUIRE,
          ]
      ).map((boardType) => {
        const timeChanges = changes[boardType]?.reduce((acc, change) => {
          const time = moment(change.timestamp).format("MMM Do, YYYY h:mm A");

          if (!Object.keys(acc).includes(time)) {
            acc[time] = {
              time: change.timestamp,
              added: change.count > 0 ? change.count : 0,
              removed: change.count < 0 ? Math.abs(change.count) : 0,
              changes: [change],
            };
          } else {
            if (change.count > 0) acc[time].added += change.count;
            else acc[time].removed += Math.abs(change.count);

            acc[time].changes.push(change);
          }

          return acc;
        }, {} as { [key: string]: DeckChangeTime });

        return Object.values(timeChanges || {}).sort((a, b) => {
          return (
            new Date((b as any).changes[0].timestamp).getTime() -
            new Date((a as any).changes[0].timestamp).getTime()
          );
        }) as DeckChangeTime[];
      })
    );
  }, [changes]);

  return (
    <View className={`${className} flex`}>
      <Text size="lg" weight="bold" className="mb-2">
        Change Log
      </Text>

      <TabBar
        tabs={(deck.isCollection
          ? [BoardTypes.MAIN, "trade", BoardTypes.ACQUIRE]
          : [
              BoardTypes.MAIN,
              BoardTypes.SIDE,
              BoardTypes.MAYBE,
              BoardTypes.ACQUIRE,
            ]
        ).map((title, boardIndex) => ({
          title: titleCase(title),
          onClick: () => setOpenIndex(-1),
          children: (
            <View className="flex min-h-[300px] max-h-[300px] overflow-x-hidden overflow-y-auto">
              {boardChanges[boardIndex]?.length ? (
                boardChanges[boardIndex].map((timeChange, timeIndex) => (
                  <View key={timeIndex}>
                    <Pressable
                      key={timeChange.time.toString()}
                      className={`flex-1 flex max-h-8 transition-all duration-300`}
                      onPress={() => {
                        if (openIndex === timeIndex) setOpenIndex(-1);
                        else setOpenIndex(timeIndex);
                      }}
                    >
                      <View className="flex-1 flex flex-row justify-between items-center gap-2 px-2 py-1 w-full min-h-8 hover:bg-primary-200 hover:bg-opacity-30 transition-all duration-300">
                        <View className="flex flex-row items-center gap-4 pl-2">
                          <Icon
                            size="sm"
                            icon={faChevronRight}
                            className={`transition-all duration-300 ${
                              openIndex === timeIndex ? "rotate-[450deg]" : ""
                            }`}
                          />

                          <Text weight="medium">
                            {moment(timeChange.time).format(
                              "MMM Do, YYYY h:mm A"
                            )}
                          </Text>
                        </View>

                        <View className="flex flex-row gap-2">
                          <Text mono action="success" weight="semi">
                            + {timeChange.added}
                          </Text>

                          <Text mono action="danger" weight="semi">
                            - {timeChange.removed}
                          </Text>
                        </View>
                      </View>
                    </Pressable>

                    <Divider thick />

                    <View
                      className={`${
                        openIndex === timeIndex ? "max-h-[232px]" : "max-h-0"
                      } flex w-full cursor-default overflow-y-scroll transition-all duration-300`}
                    >
                      {timeChange.changes.map((change, changeIndex) => (
                        <View key={change.id + changeIndex}>
                          <View
                            className={`flex flex-row justify-between items-center pl-12 pr-6 py-1 w-full min-h-8 hover:bg-primary-200 transition-all duration-300`}
                          >
                            <Text size="sm" weight="semi">
                              {change.name}
                            </Text>

                            <Text
                              mono
                              size="sm"
                              action={change.count > 0 ? "success" : "danger"}
                            >
                              {change.count > 0 ? "+" : "-"}
                              {Math.abs(change.count)}
                            </Text>
                          </View>

                          <Divider thick />
                        </View>
                      ))}
                    </View>
                  </View>
                ))
              ) : (
                <Text className="italic px-3 py-2">
                  No changes have been made to this board!
                </Text>
              )}
            </View>
          ),
        }))}
      />
      <Divider thick />
    </View>
  );
}
