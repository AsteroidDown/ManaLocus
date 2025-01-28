import { createContext } from "react";

const BuilderHeightContext = createContext({
  builderHeight: 0,
  setBuilderHeight: (height: number) => {},
});

export default BuilderHeightContext;
