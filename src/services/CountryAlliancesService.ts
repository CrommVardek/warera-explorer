import type {
  GraphNode,
  GraphRelationship,
} from "../components/common/graph/Graph";
import type { Country } from "../models/country/Country";

export function buildAllianceGraph(countries: Country[]) {
  const nodes: GraphNode[] = countries.map((c) => ({
    id: c._id,
    label: c.name,
    color: c.scheme,
  }));

  const nodeIds = new Set(nodes.map((n) => n.id));

  const edges: GraphRelationship[] = [];
  const seen = new Set<string>();

  for (const c of countries) {
    for (const ally of c.allies) {
      // Skip if ally does not exist in nodes
      if (!nodeIds.has(ally)) continue;

      const a = `${c._id}-${ally}`;
      const b = `${ally}-${c._id}`;
      if (seen.has(a) || seen.has(b)) continue;

      seen.add(a);
      seen.add(b);

      edges.push({ id: a, source: c._id, target: ally });
    }
  }

  console.log(
    `Built alliance graph with ${nodes.length} nodes and ${edges.length} edges.`
  );
  console.log(nodes);
  console.log(edges);

  return { nodes, edges };
}
