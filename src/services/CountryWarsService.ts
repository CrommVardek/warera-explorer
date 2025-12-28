import type {
  GraphNode,
  GraphRelationship,
} from "../components/common/graph/Graph";
import type { Country } from "../models/country/Country";
import { warEraColorToHex } from "../utils/colorUtils";

export const buildWarGraph = (countries: Country[]) => {
  const nodes: GraphNode[] = countries.map((c) => ({
    id: c._id,
    label: c.name,
    color: warEraColorToHex(c.scheme),
    options: {
      radius: 15 + Math.min(40, (c.warsWith.length + (c.enemy ? 1 : 0)) * 2),
    },
  }));

  const nodeIds = new Set(nodes.map((n) => n.id));

  const edges: GraphRelationship[] = [];
  const seen = new Set<string>();

  for (const c of countries) {
    for (const enemy of c.warsWith) {
      // Skip if enemy does not exist in nodes
      if (!nodeIds.has(enemy)) continue;

      const a = `${c._id}-${enemy}`;
      const b = `${enemy}-${c._id}`;
      if (seen.has(a) || seen.has(b)) continue;

      seen.add(a);
      seen.add(b);

      edges.push({ id: a, source: c._id, target: enemy });
    }
    //Sworn Enemy
    if (c.enemy && nodeIds.has(c.enemy)) {
      const a = `${c._id}-${c.enemy}`;
      const b = `${c.enemy}-${c._id}`;
      if (seen.has(a) || seen.has(b)) continue;

      seen.add(a);
      seen.add(b);

      edges.push({ id: a, source: c._id, target: c.enemy });
    }
  }
  return { nodes, edges };
};
