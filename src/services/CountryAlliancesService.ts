import type {
  GraphNode,
  GraphRelationship,
} from "../components/common/graph/Graph";
import type { Alliance } from "../models/alliance/Alliance";
import type { Country } from "../models/country/Country";
import { warEraColorToHex } from "../utils/colorUtils";

export const buildAllianceGraph = (
  alliances: Alliance[],
  countries: Country[],
  visibleCountryIds?: Set<string>
) => {
  const countryById = new Map(countries.map((c) => [c._id, c]));
  const allMemberIds = new Set(
    alliances.flatMap((a) => a.memberCountries.map((m) => m.country))
  );

  const nodes: GraphNode[] = [];
  const edges: GraphRelationship[] = [];

  const visibleAlliances = visibleCountryIds
    ? alliances.filter((a) =>
        a.memberCountries.some((m) => visibleCountryIds.has(m.country))
      )
    : alliances;

  for (const alliance of visibleAlliances) {
    const memberCount = alliance.memberCountries.length;
    nodes.push({
      id: `alliance-${alliance._id}`,
      label: alliance.name,
      color: warEraColorToHex(alliance.scheme),
      options: { radius: 22 + memberCount * 3, isHub: true },
    });

    const members = visibleCountryIds
      ? alliance.memberCountries.filter((m) => visibleCountryIds.has(m.country))
      : alliance.memberCountries;

    for (const member of members) {
      const country = countryById.get(member.country);
      if (!country) continue;

      nodes.push({
        id: country._id,
        label: country.name,
        color: warEraColorToHex(country.scheme),
        options: { radius: 12 },
        imgUrl: member.suspended ? undefined : undefined,
      });

      edges.push({
        id: `member-${country._id}-${alliance._id}`,
        source: country._id,
        target: `alliance-${alliance._id}`,
      });
    }
  }

  // Countries not in any alliance
  for (const country of countries) {
    if (allMemberIds.has(country._id)) continue;
    if (visibleCountryIds && !visibleCountryIds.has(country._id)) continue;
    nodes.push({
      id: country._id,
      label: country.name,
      color: warEraColorToHex(country.scheme),
      options: { radius: 12 },
    });
  }

  // Defensive pact edges between countries
  const nodeIds = new Set(nodes.map((n) => n.id));
  const seenPacts = new Set<string>();
  for (const country of countries) {
    if (!country.defensivePacts?.length) continue;
    if (!nodeIds.has(country._id)) continue;
    for (const partnerId of country.defensivePacts) {
      if (!nodeIds.has(partnerId)) continue;
      const key = [country._id, partnerId].sort().join("-");
      if (seenPacts.has(key)) continue;
      seenPacts.add(key);
      edges.push({
        id: `pact-${key}`,
        source: country._id,
        target: partnerId,
        graphRelationshipOptions: { dashed: true, color: "#4a90d9" },
      });
    }
  }

  return { nodes, edges };
};
