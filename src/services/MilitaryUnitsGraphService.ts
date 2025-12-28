import type { GraphNode, GraphRelationship } from "../components/common/graph/Graph";
import type { Country } from "../models/country/Country";
import type { MilitaryUnit } from "../models/mu/MilitaryUnit";
import type { User } from "../models/user/User";
import { warEraColorToHex } from "../utils/colorUtils";



export const buildMuCountriesGraph = (militaryUnits: MilitaryUnit[], countries: Country[], users: User[]) => {
    const countryNodes: GraphNode[] = countries.map((c) => ({
        id: c._id,
        label: c.name,
        color: warEraColorToHex(c.scheme),
        options: {
          radius: 30,
        },
    }));
    
    const muNodes: GraphNode[] = militaryUnits.map((mu) => ({
        id: mu._id,
        label: mu.name,
        imgUrl: mu.avatarUrl,
        options: {
            radius: 5 + (mu.members.length)
        }
    }));

    const nodes = [...countryNodes, ...muNodes];

    const nodeIds = new Set(nodes.map((n) => n.id));

    const edges: GraphRelationship[] = [];
    const seen = new Set<string>();
    
    for (const mu of militaryUnits) {
          
        const muCountries = [...new Set(mu.members
            .map(m => users?.find(u => u._id === m))
            .map(u => u?.country)
            .filter(c => c !== undefined)
        )];

        for (const countryId of muCountries) {
          // Skip if country does not exist in nodes
            if (!nodeIds.has(countryId)) continue;
    
          const a = `${mu._id}-${countryId}`;
          const b = `${countryId}-${mu._id}`;
          if (seen.has(a) || seen.has(b)) continue;

          seen.add(a);
            seen.add(b);
            
            const numberOfMembers = mu.members.map(m => users?.find(u => u._id === m)).filter(u => u?.country === countryId).length;
    
          edges.push({ id: a, source: mu._id, target: countryId, graphRelationshipOptions: { label: numberOfMembers.toString()} } as GraphRelationship);
        }
    }
    
    return { nodes, edges };
}