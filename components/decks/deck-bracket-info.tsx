import {
  BracketDetails,
  BracketNumber,
  Brackets,
} from "@/constants/mtg/brackets";
import { Card } from "@/models/card/card";
import { User } from "@/models/user/user";
import {
  faArrowUpRightFromSquare,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import CardViewMultipleModal from "../cards/card-view-multiple-modal";
import Icon from "../ui/icon/icon";
import Text from "../ui/text/text";

export default function DeckBracketInfo({
  user,
  bracket,
  bracketSet,
  bracketGuess,
}: {
  user: User;
  bracketSet?: number;
  bracketGuess: number;
  bracket: BracketDetails;
}) {
  const bracketNumber = bracketSet ?? bracketGuess;
  const bracketType = BracketNumber[bracketNumber];
  const bracketInfo = Brackets[bracketType];

  const [open, setOpen] = useState(false);
  const [viewType, setViewType] = useState("Game Changers");
  const [cardsToView, setCardsToView] = useState([] as Card[]);

  function viewCards(title: string, cards: Card[]) {
    setOpen(true);
    setViewType(title);
    setCardsToView(cards);
  }

  return (
    <View className="flex mb-1">
      <Text size="md" weight="semi">
        {`This deck is bracket ${bracketNumber}: ${bracketType}`}
      </Text>

      <Pressable
        className="flex flex-row items-center gap-2"
        onPress={() =>
          bracket.gameChangers?.length &&
          viewCards("Game Changers", bracket.gameChangers)
        }
      >
        <Icon className="!text-success-400" icon={faCheckCircle} />

        <Text size="sm">
          {bracketInfo.gameChangers
            ? bracketInfo.maxGameChangers
              ? `Up to ${bracketInfo.maxGameChangers} game changers`
              : "Any number of game changers"
            : "No game changers"}
        </Text>

        {(bracket.gameChangers?.length || 0) > 0 && (
          <Icon size="xs" icon={faArrowUpRightFromSquare} />
        )}
      </Pressable>

      <Pressable
        className="flex flex-row items-center gap-2"
        onPress={() =>
          bracket.tutors?.length && viewCards("Tutors", bracket.tutors)
        }
      >
        <Icon className="!text-success-400" icon={faCheckCircle} />

        <Text size="sm">
          {bracketInfo.tutors
            ? bracketInfo.maxTutors
              ? `Few (<= ${bracketInfo.maxTutors}) tutors`
              : "Any number of tutors"
            : "No tutors"}
        </Text>

        {(bracket.tutors?.length || 0) > 0 && (
          <Icon size="xs" icon={faArrowUpRightFromSquare} />
        )}
      </Pressable>

      <Pressable
        className="flex flex-row items-center gap-2"
        onPress={() =>
          bracket.extraTurns?.length &&
          viewCards("Extra Turns", bracket.extraTurns)
        }
      >
        <Icon className="!text-success-400" icon={faCheckCircle} />

        <Text size="sm">
          {bracketInfo.extraTurns
            ? "Extra turns allowed"
            : "No mass extra turns"}
        </Text>

        {(bracket.extraTurns?.length || 0) > 0 && (
          <Icon size="xs" icon={faArrowUpRightFromSquare} />
        )}
      </Pressable>

      <Pressable
        className="flex flex-row items-center gap-2"
        onPress={() =>
          bracket.massLandDenial?.length &&
          viewCards("Mass Land Denial", bracket.massLandDenial)
        }
      >
        <Icon className="!text-success-400" icon={faCheckCircle} />

        <Text size="sm">
          {bracketInfo.massLandDenial
            ? "Mass land denial allowed"
            : "No mass land denial"}
        </Text>

        {(bracket.massLandDenial?.length || 0) > 0 && (
          <Icon size="xs" icon={faArrowUpRightFromSquare} />
        )}
      </Pressable>

      <View className="flex flex-row items-center gap-2">
        <Icon className="!text-success-400" icon={faCheckCircle} />

        <Text size="sm">
          {bracketInfo.chainingExtraTurns
            ? "Chaining extra turns allowed"
            : "No chaining extra turns"}{" "}
          <Text size="xs" className="italic">
            (Not tracked)
          </Text>
        </Text>
      </View>

      <View className="flex flex-row items-center gap-2">
        <Icon className="!text-success-400" icon={faCheckCircle} />

        <Text size="sm">
          {bracketInfo.chainingExtraTurns
            ? "Two card infinites allowed"
            : "No two card infinites"}{" "}
          <Text size="xs" className="italic">
            (Not tracked)
          </Text>
        </Text>
      </View>

      <View className="flex flex-row items-center gap-2 mt-2">
        <Icon className="!text-success-400" icon={faCheckCircle} />

        <Text size="xs" className="italic max-w-[304px]">
          {bracketSet
            ? `${
                user?.name ?? "This user"
              } has set their deck to ${bracketNumber}: ${bracketType}, our guess is ${
                BracketNumber[bracket.bracket]
              }: ${bracket.bracket}. `
            : "This is a guess and may not be accurate. "}
          If you believe we've made a mistake,{" "}
          <Link className="text-primary-400" href="help/contact">
            please contact us
          </Link>{" "}
          or view our{" "}
          <Link className="text-primary-400" href="help/brackets">
            bracket guide
          </Link>
          .
        </Text>
      </View>

      <CardViewMultipleModal
        title={viewType}
        cards={cardsToView}
        open={open}
        setOpen={setOpen}
      />
    </View>
  );
}
