import { createContext } from "react";

const LoadingContext = createContext({
  loading: false,
  setLoading: (value: boolean) => {},
});

export default LoadingContext;
