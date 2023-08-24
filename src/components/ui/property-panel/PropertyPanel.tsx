import { useMemo } from "react";
import useUI from "../../../hooks/useUI";
import { Config as DynamicConfig } from "../../../helpers/SecondOrderDynamics";
import ParentProperty from "./parent-property/ParentProperty";
import DynamicsConfigProperty from "./dynamics-config-property/DynamicsConfigProperty";

export default function PropertyPanel() {
  const { selectedNode: selectedID, selectNode, data: nodes } = useUI();

  const properties = useMemo(() => {
    if (!nodes || !selectedID) return null;
    const selectedNode = nodes.get(selectedID);

    if (!selectedNode) throw new Error(`Node ${selectedID} not found`);

    let parentNode = null;
    if (selectedNode.properties.parent) {
      parentNode = nodes.get(selectedNode.properties.parent.id);
      if (!parentNode)
        throw new Error(`Node ${selectedNode.properties.parent.id} not found`);
    }

    const childrenNodes = selectedNode.properties.children.map((child) => {
      const node = nodes.get(child);
      if (!node) throw new Error(`Node ${child} not found`);
      return node;
    });

    const dynamicConfig: DynamicConfig = {
      response: selectedNode.properties.response,
      dampen: selectedNode.properties.dampen,
      eager: selectedNode.properties.eager,
    };

    return {
      selected: selectedNode,
      parent: parentNode,
      children: childrenNodes,
      dynamicsConfig: dynamicConfig,
    };
  }, [nodes, selectedID]);

  if (!selectedID || !selectNode || !properties) {
    return (
      <div className="flex items-center justify-center h-full">
        <span>Select a node to view its properties</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 items-stretch overflow-y-auto h-full">
      <PropertyField label="Name">
        <span>{properties.selected.name}</span>
      </PropertyField>
      <PropertyField label="Parent">
        <ParentProperty meta={properties.selected} />
      </PropertyField>
      {properties.children.length <= 0 ? (
        <></>
      ) : (
        <PropertyField label="Children">
          <div className="max-h-64 overflow-y-auto flex flex-col gap-1 items-stretch">
            {properties.children.map((child) => (
              <button
                key={child.id}
                onClick={() => selectNode(child.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.currentTarget.click();
                  }
                }}
              >
                {child.name}
              </button>
            ))}
          </div>
        </PropertyField>
      )}
      <DynamicsConfigProperty meta={properties.selected} />
    </div>
  );
}

export function PropertyField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <div className="flex flex-col gap-1 items-stretch">
      <span className="text-sm font-bold truncate">{label}</span>
      <div className="pl-4 flex-1 border-l-2 border-gray-200">{children}</div>
    </div>
  );
}
