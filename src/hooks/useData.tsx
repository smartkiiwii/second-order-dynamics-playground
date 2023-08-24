import { useReducer } from "react";
import { Meta as NodeMeta } from "../game/node/Node";

const jsonified: NodeMeta[] = [
  {
    id: "21d250c0-bdf2-4d10-9a82-5443b0851c6a",
    name: "Main",
    properties: {
      children: ["d759fa26-32c3-4f16-afe8-8e7f3b237e0a"],
      parent: null,
      response: 0.001,
      dampen: 0.5,
      eager: 0,
    },
  },
  {
    id: "d759fa26-32c3-4f16-afe8-8e7f3b237e0a",
    name: "Child",
    properties: {
      children: [],
      parent: {
        id: "21d250c0-bdf2-4d10-9a82-5443b0851c6a",
        offset: {
          x: 0,
          y: 100,
        },
      },
      response: 0.0005,
      dampen: 0.5,
      eager: 1,
    },
  },
];

const initial: Data = new Map<string, NodeMeta>();
jsonified.forEach((meta) => initial.set(meta.id, meta));

function dispatch(data: Data, action: Op) {
  switch (action.type) {
    case "add":
      return handleAdd(data, action);
    case "remove":
      return handleRemove(data, action);
    case "update":
      return handleUpdate(data, action);
    default:
      throw new Error("Invalid action type");
  }
}

function handleAdd(data: Data, action: AddOp) {
  const map = new Map(data);
  map.set(action.node.id, action.node);
  return map;
}

function handleUpdate(data: Data, action: UpdateOp) {
  const map = new Map(data);
  map.set(action.id, action.node);
  return map;
}

function handleRemove(data: Data, action: RemoveOp) {
  const map = new Map(data);

  const node = map.get(action.id);

  if (!node) {
    throw new Error(`Node ${action.id} does not exist`);
  }

  const parent = node.properties.parent
    ? map.get(node.properties.parent.id)
    : null;

  if (parent) {
    parent.properties.children = parent.properties.children.filter(
      (childId) => childId !== action.id
    );
  }

  node.properties.children.forEach((childId) => {
    map.get(childId)!.properties.parent = null;
  });

  map.delete(action.id);
  return map;
}

export default function useData(): [Data, DataDispatch] {
  const [data, dispatchData] = useReducer(dispatch, initial);
  return [data, dispatchData];
}

export interface AddOp {
  type: "add";
  node: NodeMeta;
}

export interface RemoveOp {
  type: "remove";
  id: string;
}

export interface UpdateOp {
  type: "update";
  id: string;
  node: NodeMeta;
}

export type Op = AddOp | RemoveOp | UpdateOp;
export type Data = Map<string, NodeMeta>;
export type DataDispatch = React.Dispatch<Op>;
