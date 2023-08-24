import { createContext } from "react";
import { Data, DataDispatch } from "../hooks/useData";

const DataContext = createContext<Data | null>(null);

const DataDispatchContext = createContext<DataDispatch | null>(null);
export { DataContext, DataDispatchContext };
