import { BoardType, BoardTypes } from "@/constants/boards";
import { titleCase } from "@/functions/text-manipulation";
import DeckService from "@/hooks/services/deck.service";
import { Deck } from "@/models/deck/deck";
import { DeckCardChange, DeckChange } from "@/models/deck/deck-change";
import moment from "moment";
import React, { useEffect } from "react";
import { Pressable, View, ViewProps } from "react-native";
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
      [
        BoardTypes.MAIN,
        BoardTypes.SIDE,
        BoardTypes.MAYBE,
        BoardTypes.ACQUIRE,
      ].map((boardType) => {
        const timeChanges = changes[boardType as BoardType].reduce(
          (acc, change) => {
            const time = moment(change.timestamp).format("MMM D, YYYY h:mm A");

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
          },
          {} as { [key: string]: DeckChangeTime }
        );

        return Object.values(timeChanges).sort((a, b) => {
          return (
            new Date(b.changes[0].timestamp).getTime() -
            new Date(a.changes[0].timestamp).getTime()
          );
        });
      })
    );
  }, [changes]);

  return (
    <View className={`${className} flex`}>
      <Text size="lg" thickness="bold" className="mb-2">
        Change Log
      </Text>

      <TabBar
        tabs={[
          BoardTypes.MAIN,
          BoardTypes.SIDE,
          BoardTypes.MAYBE,
          BoardTypes.ACQUIRE,
        ].map((title, boardIndex) => ({
          title: titleCase(title),
          onClick: () => setOpenIndex(-1),
          children: (
            <View className="flex min-h-[300px] max-h-[300px] bg-dark-100 border-2 border-background-200 rounded-b-xl rounded-tr-xl overflow-x-hidden overflow-y-auto">
              {boardChanges[boardIndex]?.map((timeChange, timeIndex) => (
                <View key={timeIndex}>
                  <Pressable
                    key={timeChange.time.toString()}
                    className={`${
                      timeIndex % 2 === 0 ? "bg-dark-100" : "bg-dark-200"
                    } flex-1 flex max-h-8 transition-all duration-300`}
                    onPress={() => {
                      if (openIndex === timeIndex) setOpenIndex(-1);
                      else setOpenIndex(timeIndex);
                    }}
                  >
                    <View className="flex-1 flex flex-row justify-between items-center gap-2 px-2 py-1 w-full min-h-8 hover:bg-primary-200 transition-all duration-300">
                      <Text thickness="bold">
                        {moment(timeChange.time).format("MMM D, YYYY h:mm A")}
                      </Text>

                      <View className="flex flex-row gap-2">
                        <Text mono action="success" thickness="semi">
                          + {timeChange.added}
                        </Text>

                        <Text mono action="danger" thickness="semi">
                          - {timeChange.removed}
                        </Text>
                      </View>
                    </View>
                  </Pressable>

                  <View
                    className={`${
                      openIndex === timeIndex ? "max-h-[232px] mb-2" : "max-h-0"
                    } flex w-full cursor-default overflow-y-scroll transition-all duration-300`}
                  >
                    {timeChange.changes.map((change, changeIndex) => (
                      <View
                        key={change.id + changeIndex}
                        className={`${
                          (timeIndex + changeIndex) % 2
                            ? "bg-background-100"
                            : "bg-background-200"
                        } flex flex-row justify-between items-center pl-6 pr-2 py-1 w-full min-h-8 hover:bg-primary-200 transition-all duration-300`}
                      >
                        <Text size="sm" thickness="semi">
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
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ),
        }))}
      />
    </View>
  );
}
