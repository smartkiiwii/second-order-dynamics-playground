import useUI from "../../../../hooks/useUI";

export default function NodeSelector({
  nodes,
  callback,
  className,
}: {
  nodes: string[];
  callback: (nodeID: string) => void;
  className?: string;
}) {
  const { data } = useUI();

  if (!data) {
    return <></>;
  }

  return (
    <div className={className}>
      {nodes.length > 0 ? (
        nodes.map((id) => {
          const node = data.get(id);

          if (!node) throw new Error(`Node ${id} not found`);

          return (
            <button
              key={id}
              onClick={() => callback(id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  callback(id);
                }
              }}
              className="bg-transparent"
            >
              <span className="truncate text-sm">{node.name}</span>
            </button>
          );
        })
      ) : (
        <span className="text-sm text-center">No nodes available</span>
      )}
    </div>
  );
}
