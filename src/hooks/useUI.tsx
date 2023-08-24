import { useContext } from "react";
import { DataContext, DataDispatchContext } from "../contexts/DataContext";
import { SelectNodeContext, SelectedNodeContext } from "../contexts/UIContext";

export default function useUI() {
  const data = useContext(DataContext);
  const dataDispatch = useContext(DataDispatchContext);
  const selectedNode = useContext(SelectedNodeContext);
  const selectNode = useContext(SelectNodeContext);

  return {
    data,
    dataDispatch,
    selectedNode,
    selectNode,
  };
}
