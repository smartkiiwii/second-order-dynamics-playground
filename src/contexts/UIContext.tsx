import { Dispatch, SetStateAction, createContext } from "react";

const SelectedNodeContext = createContext<string | null>(null);
const SelectNodeContext = createContext<Dispatch<
  SetStateAction<string | null>
> | null>(null);

export { SelectedNodeContext, SelectNodeContext };
