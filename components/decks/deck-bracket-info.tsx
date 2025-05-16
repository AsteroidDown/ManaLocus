import {
  BracketDetails,
  BracketNumber,
  Brackets,
} from "@/constants/mtg/brackets";
import { Card } from "@/models/card/card";
import {
  faArrowUpRightFromSquare,
  faCheckCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import CardViewMultipleModal from "../cards/card-view-multiple-modal";
import Text from "../ui/text/text";

export default function DeckBracketInfo({
  bracket,
}: {
  bracket: BracketDetails;
}) {
  const bracketInfo = Brackets[bracket.bracket];

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
        This deck is in bracket {BracketNumber[bracket.bracket]},{" "}
        {bracket.bracket}
      </Text>

      <Pressable
        className="flex flex-row items-center gap-2"
        onPress={() =>
          bracket.gameChangers?.length &&
          viewCards("Game Changers", bracket.gameChangers)
        }
      >
        <FontAwesomeIcon icon={faCheckCircle} className={"text-success-400"} />

        <Text size="sm">
          {bracketInfo.gameChangers
            ? bracketInfo.maxGameChangers
              ? `Up to ${bracketInfo.maxGameChangers} game changers`
              : "Any number of game changers"
            : "No game changers"}
        </Text>

        {(bracket.gameChangers?.length || 0) > 0 && (
          <FontAwesomeIcon
            size="sm"
            icon={faArrowUpRightFromSquare}
            className="text-white"
          />
        )}
      </Pressable>

      <Pressable
        className="flex flex-row items-center gap-2"
        onPress={() =>
          bracket.tutors?.length && viewCards("Tutors", bracket.tutors)
        }
      >
        <FontAwesomeIcon icon={faCheckCircle} className={"text-success-400"} />

        <Text size="sm">
          {bracketInfo.tutors
            ? bracketInfo.maxTutors
              ? `Few (<= ${bracketInfo.maxTutors}) tutors`
              : "Any number of tutors"
            : "No tutors"}
        </Text>

        {(bracket.tutors?.length || 0) > 0 && (
          <FontAwesomeIcon
            size="sm"
            icon={faArrowUpRightFromSquare}
            className="text-white"
          />
        )}
      </Pressable>

      <Pressable
        className="flex flex-row items-center gap-2"
        onPress={() =>
          bracket.extraTurns?.length &&
          viewCards("Extra Turns", bracket.extraTurns)
        }
      >
        <FontAwesomeIcon icon={faCheckCircle} className={"text-success-400"} />

        <Text size="sm">
          {bracketInfo.extraTurns
            ? "Extra turns allowed"
            : "No mass extra turns"}
        </Text>

        {(bracket.extraTurns?.length || 0) > 0 && (
          <FontAwesomeIcon
            size="sm"
            icon={faArrowUpRightFromSquare}
            className="text-white"
          />
        )}
      </Pressable>

      <Pressable
        className="flex flex-row items-center gap-2"
        onPress={() =>
          bracket.massLandDenial?.length &&
          viewCards("Mass Land Denial", bracket.massLandDenial)
        }
      >
        <FontAwesomeIcon icon={faCheckCircle} className={"text-success-400"} />

        <Text size="sm">
          {bracketInfo.massLandDenial
            ? "Mass land denial allowed"
            : "No mass land denial"}
        </Text>

        {(bracket.massLandDenial?.length || 0) > 0 && (
          <FontAwesomeIcon
            size="sm"
            icon={faArrowUpRightFromSquare}
            className="text-white"
          />
        )}
      </Pressable>

      <View className="flex flex-row items-center gap-2">
        <FontAwesomeIcon icon={faCheckCircle} className={"text-success-400"} />

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
        <FontAwesomeIcon icon={faCheckCircle} className={"text-success-400"} />

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
        <FontAwesomeIcon icon={faInfoCircle} className="text-white" />

        <Text size="xs" className="italic">
          This is a guess and may not be accurate. If you believe we've made a
          mistake, please contact us by{" "}
          <Link
            className="text-primary-400"
            href="mailto:support@manalocus.com"
          >
            email
          </Link>{" "}
          or on our{" "}
          <Link
            className="text-primary-400"
            href="https://discord.gg/qmsPDd9pva"
          >
            Discord
          </Link>
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
