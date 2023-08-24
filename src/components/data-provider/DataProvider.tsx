import { ReactNode } from "react";
import useData from "../../hooks/useData";
import { DataContext, DataDispatchContext } from "../../contexts/DataContext";

export default function DataProvider({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  const [data, dispatchData] = useData();

  return (
    <DataContext.Provider value={data}>
      <DataDispatchContext.Provider value={dispatchData}>
        {children}
      </DataDispatchContext.Provider>
    </DataContext.Provider>
  );
}
