import type { GraphNode } from "../components/common/graph/Graph";
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

}