import type { GraphNode, GraphEdge } from "../components/common/graph/Graph";
import type { Country } from "../models/country/Country";

export function buildAllianceGraph(countries: Country[]) {
  const nodes: GraphNode[] = countries.map(c => ({
    id: c.id,
    label: c.name,
  }));

  const nodeIds = new Set(nodes.map(n => n.id));

  const edges: GraphEdge[] = [];
  const seen = new Set<string>();

  for (const c of countries) {
    for (const ally of c.allies) {
      // Skip if ally does not exist in nodes
      if (!nodeIds.has(ally)) continue;

      const a = `${c.id}-${ally}`;
      const b = `${ally}-${c.id}`;
      if (seen.has(a) || seen.has(b)) continue;

      seen.add(a);
      seen.add(b);

      edges.push({ id: a, source: c.id, target: ally });
    }
  }

  return { nodes, edges };
}

