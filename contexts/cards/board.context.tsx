import { BoardType, BoardTypes } from "@/constants/boards";
import { createContext } from "react";

const BoardContext = createContext({
  board: BoardTypes.MAIN as BoardType,
  setBoard: (board: BoardType) => {},
});

export default BoardContext;
