import { useCallback, useEffect, useMemo, useState } from "react";
import { Meta as MetaNode } from "../../../../game/node/Node";
import useUI from "../../../../hooks/useUI";
import { Icon } from "@iconify/react/dist/iconify.js";
import NodeSelector from "../node-selector/NodeSelector";
import { Data as AllMeta } from "../../../../hooks/useData";
import { traverse } from "../../../../game/graph/traverse";
import { PropertyField } from "../PropertyPanel";

export default function ParentProperty({ meta }: { meta: MetaNode }) {
  const { data, selectedNode, dataDispatch: dispatch, selectNode } = useUI();
  const [isEditing, setIsEditing] = useState(false);
  const parent = useMemo(() => {
    if (!data || !meta.properties.parent) return null;

    const node = data.get(meta.properties.parent.id);
    if (!node) throw new Error(`Node ${meta.properties.parent.id} not found`);

    return node;
  }, [data, meta.properties.parent]);

  const editParent = useCallback(
    (id: string | null) => {
      if (!data || !meta || !dispatch) return;

      if (id === parent?.id) {
        return;
      }

      if (parent && parent.id !== id) {
        // Remove child from parent's children
        const newParent: MetaNode = {
          ...parent,
          properties: {
            ...parent.properties,
            children: parent.properties.children.filter(
              (child) => child !== meta.id
            ),
          },
        };

        dispatch({
          type: "update",
          id: parent.id,
          node: newParent,
        });
      }

      if (id) {
        // Add child to parent's children
        const parent = data.get(id);
        if (!parent) throw new Error(`Node ${id} not found`);

        const newParent: MetaNode = {
          ...parent,
          properties: {
            ...parent.properties,
            children: [...parent.properties.children, meta.id],
          },
        };

        dispatch({
          type: "update",
          id: parent.id,
          node: newParent,
        });
      }

      const newMeta: MetaNode = {
        ...meta,
        properties: {
          ...meta.properties,
          parent: id
            ? {
                id,
                offset: {
                  x: 0,
                  y: 0,
                },
              }
            : null,
        },
      };

      dispatch({
        type: "update",
        id: meta.id,
        node: newMeta,
      });
    },
    [data, dispatch, meta, parent]
  );

  const removeParent = useCallback(() => {
    return editParent(null);
  }, [editParent]);

  useEffect(() => {
    if (!selectedNode || !meta) return;
    setIsEditing(false);
  }, [meta, selectedNode]);

  const availableNodes = useMemo(() => {
    if (!data || !meta || !isEditing) return [];
    return getAvailableNodes(data, meta);
  }, [data, isEditing, meta]);

  if (!selectNode || !dispatch || !editParent || !data) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-2 justify-stretch items-stretch">
      {meta.properties.parent && parent ? (
        <div className="flex flex-row gap-1 justify-stretch items-stretch rounded bg-gray-100">
          <button
            className="text-left truncate flex-1 bg-transparent"
            onClick={(e) => {
              e.preventDefault();
              selectNode(meta.properties.parent!.id);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.click();
              }
            }}
          >
            <span className="truncate">{parent.name}</span>
          </button>
          <button
            className="text-left flex-none bg-transparent"
            onClick={() => {
              removeParent();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.click();
              }
            }}
          >
            <Icon icon="material-symbols:delete-rounded" width="16px" />
          </button>
          <button
            className="text-left flex-none bg-transparent"
            onClick={() => {
              setIsEditing(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.click();
              }
            }}
          >
            <Icon icon="material-symbols:edit-rounded" width="16px" />
          </button>
        </div>
      ) : (
        <button
          className="truncate flex-1 bg-gray-100"
          onClick={() => {
            setIsEditing(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.click();
            }
          }}
        >
          <span className="truncate">Attach parent</span>
        </button>
      )}
      {!meta.properties.parent || !parent ? (
        <></>
      ) : (
        <PropertyField label="Offset Configuration">
          <PropertyField label="x">
            <input
              className="w-full bg-gray-100 p-2"
              type="number"
              value={meta.properties.parent.offset.x}
              onChange={(e) => {
                let value = parseFloat(e.target.value);
                if (isNaN(value)) value = 0;
                const newMeta: MetaNode = {
                  ...meta,
                  properties: {
                    ...meta.properties,
                    parent: {
                      ...meta.properties.parent!,
                      offset: {
                        ...meta.properties.parent!.offset,
                        x: value,
                      },
                    },
                  },
                };
                dispatch({
                  type: "update",
                  id: meta.id,
                  node: newMeta,
                });
              }}
            />
          </PropertyField>
          <PropertyField label="y">
            <input
              className="w-full bg-gray-100 p-2"
              type="number"
              value={meta.properties.parent.offset.y}
              onChange={(e) => {
                let value = parseFloat(e.target.value);
                if (isNaN(value)) value = 0;
                const newMeta: MetaNode = {
                  ...meta,
                  properties: {
                    ...meta.properties,
                    parent: {
                      ...meta.properties.parent!,
                      offset: {
                        ...meta.properties.parent!.offset,
                        y: value,
                      },
                    },
                  },
                };
                dispatch({
                  type: "update",
                  id: meta.id,
                  node: newMeta,
                });
              }}
            />
          </PropertyField>
        </PropertyField>
      )}
      {!isEditing ? (
        <></>
      ) : (
        <NodeSelector
          className="flex-1 flex flex-col gap-1 items-stretch p-2 bg-gray-200 rounded max-h-64 overflow-y-auto"
          callback={(id) => {
            editParent(id);
            setIsEditing(false);
          }}
          nodes={availableNodes}
        />
      )}
    </div>
  );
}

/**
 * The only valid nodes are nodes that are not the current node, and are not a child of the current node.
 * @param node
 */
function getAvailableNodes(data: AllMeta, node: MetaNode): string[] {
  const children = new Set(traverse(data, node));
  return Array.from(data.values())
    .filter((meta) => meta.id !== node.id && !children.has(meta))
    .map((meta) => meta.id);
}
