import { createContext } from "react";

const BodyHeightContext = createContext({
  bodyHeight: 0,
  setBodyHeight: (height: number) => {},
});

export default BodyHeightContext;
