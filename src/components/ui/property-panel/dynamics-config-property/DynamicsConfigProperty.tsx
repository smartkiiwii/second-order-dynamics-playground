import { useMemo } from "react";
import { Meta as MetaNode } from "../../../../game/node/Node";
import useUI from "../../../../hooks/useUI";
import { PropertyField } from "../PropertyPanel";

export default function DynamicsConfigProperty({ meta }: { meta: MetaNode }) {
  const { dataDispatch } = useUI();
  const properties = useMemo(() => {
    return meta.properties;
  }, [meta]);

  if (!dataDispatch) {
    return <></>;
  }

  return (
    <PropertyField label="Dynamics config">
      <PropertyField label="Response rate">
        <input
          className="w-full bg-gray-100 p-2"
          type="number"
          value={properties.response}
          onChange={(e) => {
            let value = parseFloat(e.target.value);
            if (isNaN(value) || value < 0.00000000001) value = 0.00000000001;
            const newMeta: MetaNode = {
              ...meta,
              properties: {
                ...meta.properties,
                response: value,
              },
            };
            dataDispatch({
              type: "update",
              id: meta.id,
              node: newMeta,
            });
          }}
        />
      </PropertyField>
      <PropertyField label="Dampening">
        <input
          className="w-full bg-gray-100 p-2"
          type="number"
          value={properties.dampen}
          onChange={(e) => {
            let value = parseFloat(e.target.value);
            if (isNaN(value)) value = 0;
            const newMeta: MetaNode = {
              ...meta,
              properties: {
                ...meta.properties,
                dampen: value,
              },
            };
            dataDispatch({
              type: "update",
              id: meta.id,
              node: newMeta,
            });
          }}
        />
      </PropertyField>
      <PropertyField label="Eagerness">
        <input
          className="w-full bg-gray-100 p-2"
          type="number"
          value={properties.eager}
          onChange={(e) => {
            let value = parseFloat(e.target.value);
            if (isNaN(value)) value = 0;
            const newMeta: MetaNode = {
              ...meta,
              properties: {
                ...meta.properties,
                eager: value,
              },
            };
            dataDispatch({
              type: "update",
              id: meta.id,
              node: newMeta,
            });
          }}
        />
      </PropertyField>
    </PropertyField>
  );
}
