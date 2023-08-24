import { useContext, useState } from "react";
import CollapsibleFlexItem from "../collapsible/CollapsibleFlexItem";
import { DataContext, DataDispatchContext } from "../../contexts/DataContext";
import { v4 as uuidv4 } from "uuid";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  SelectNodeContext,
  SelectedNodeContext,
} from "../../contexts/UIContext";
import PropertyPanel from "./property-panel/PropertyPanel";

export default function UI() {
  const data = useContext(DataContext);
  const dataDispatch = useContext(DataDispatchContext);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  if (!data || !dataDispatch) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <SelectedNodeContext.Provider value={selectedNode}>
      <SelectNodeContext.Provider value={setSelectedNode}>
        <div
          id="ui"
          className="absolute z-10 w-device-screen h-device-screen min-w-device-screen min-h-device-screen max-w-device-screen max-h-device-screen isolate pointer-events-none"
        >
          <div className="flex flex-col sm:flex-row w-full h-full justify-stretch">
            {/* Left/top bar */}
            <div className="relative basis-1/2 sm:basis-96 p-10 overflow-hidden flex flex-col items-stretch justify-stretch gap-4">
              <CollapsibleFlexItem
                className="pointer-events-auto bg-white drop-shadow rounded"
                label="Actions"
                initialCollapsed={true}
              >
                <div className="overflow-y-auto flex flex-col gap-2 p-4 items-stretch">
                  <button className="flex flex-row gap-3 items-center justify-stretch">
                    <Icon icon="material-symbols:save-rounded" width="32px" />
                    <span className="grow truncate text-left">Save</span>
                  </button>
                  <button className="flex flex-row gap-3 items-center justify-stretch">
                    <Icon
                      icon="material-symbols:folder-open-rounded"
                      width="32px"
                    />
                    <span className="grow truncate text-left">Open</span>
                  </button>
                </div>
              </CollapsibleFlexItem>
              <CollapsibleFlexItem
                className="pointer-events-auto bg-white drop-shadow rounded"
                label="Nodes"
                initialCollapsed={false}
              >
                <div className="flex flex-col items-stretch p-4 gap-2 justify-stretch h-full">
                  <button
                    className="bg-gray-500 text-white"
                    onClick={() => {
                      dataDispatch({
                        type: "add",
                        node: {
                          id: uuidv4(),
                          name: "New node",
                          properties: {
                            children: [],
                            parent: null,
                            response: 0.001,
                            dampen: 0.5,
                            eager: 1,
                          },
                        },
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.currentTarget.click();
                      }
                    }}
                  >
                    <span>Add node</span>
                  </button>
                  <div className="overflow-y-auto flex flex-col gap-2 flex-auto p-2">
                    {Array.from(data.values()).map((meta) => {
                      return (
                        <div
                          key={meta.id}
                          className={`flex flex-row gap-1 justify-stretch items-stretch rounded ${
                            selectedNode === meta.id
                              ? "bg-gray-300"
                              : "bg-gray-100"
                          } `}
                        >
                          <button
                            className="text-left truncate flex-1 bg-transparent"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedNode(meta.id);
                            }}
                            onDoubleClick={() => {
                              dataDispatch({
                                type: "update",
                                id: meta.id,
                                node: {
                                  ...meta,
                                  name:
                                    prompt("Enter a new name", meta.name) ??
                                    meta.name,
                                },
                              });
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                e.currentTarget.click();
                              }
                            }}
                          >
                            <span className="truncate">{meta.name}</span>
                          </button>
                          <button
                            className="text-left flex-none bg-transparent"
                            onClick={() => {
                              if (meta.id === selectedNode) {
                                setSelectedNode(null);
                              }

                              dataDispatch({
                                type: "remove",
                                id: meta.id,
                              });
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                e.currentTarget.click();
                              }
                            }}
                          >
                            <Icon
                              icon="material-symbols:delete-rounded"
                              width="16px"
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CollapsibleFlexItem>
            </div>
            {/* Toast window */}
            <div className="flex-1"></div>
            {/* Right/bottom bar */}
            <div className="relative basis-1/2 sm:basis-96 p-10 overflow-hidden flex flex-col-reverse items-stretch justify-stretch gap-4">
              <CollapsibleFlexItem
                className="pointer-events-auto bg-white drop-shadow rounded"
                label="Properties"
                initialCollapsed={false}
              >
                <PropertyPanel />
              </CollapsibleFlexItem>
            </div>
          </div>
        </div>
      </SelectNodeContext.Provider>
    </SelectedNodeContext.Provider>
  );
}
