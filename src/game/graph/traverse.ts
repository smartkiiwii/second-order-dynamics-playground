import { Meta as NodeMeta } from "../node/Node";

export function* traverse(map: Map<string, NodeMeta>, root: NodeMeta) {
  const queue: NodeMeta[] = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;

    yield node;

    for (const childId of node.properties.children) {
      const child = map.get(childId)!;

      queue.push(child);
    }
  }
}

export function* traverseUp(map: Map<string, NodeMeta>, node: NodeMeta) {
  yield node;

  while (node.properties.parent) {
    node = map.get(node.properties.parent.id)!;
    yield node;
  }
}
