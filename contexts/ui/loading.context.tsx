import { createContext } from "react";

const LoadingContext = createContext({
  loading: false,
  setLoading: (value: boolean) => {},

  loaded: false,
  setLoaded: (value: boolean) => {},
});

export default LoadingContext;
