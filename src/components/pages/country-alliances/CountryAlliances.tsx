import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import type { Alliance } from "../../../models/alliance/Alliance";
import type { Country } from "../../../models/country/Country";
import { buildAllianceGraph } from "../../../services/CountryAlliancesService";
import { adjustColorForBackground } from "../../../utils/colorUtils";
import { color } from "d3";

interface CountryAlliancesProps {
  alliances: Alliance[];
  countries: Country[];
}

export const CountryAlliances = ({ alliances, countries }: CountryAlliancesProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);

  useEffect(() => {
    const { nodes, edges } = buildAllianceGraph(alliances, countries);

    const memberEdges = edges.filter((e) => !e.graphRelationshipOptions?.dashed);
    const pactEdges = edges.filter((e) => e.graphRelationshipOptions?.dashed === true);

    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current!);
    svg.selectAll("*").remove();

    const zoomGroup = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        zoomGroup.attr("transform", event.transform.toString());
        setZoomTransform(event.transform);
      });

    svg.call(zoom);

    if (zoomTransform) {
      svg.transition().duration(400).call(zoom.transform, zoomTransform);
    }

    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3
          .forceLink(edges as any)
          .id((d: any) => d.id)
          .distance((e: any) => (e.graphRelationshipOptions?.dashed ? 160 : 80))
          .strength((e: any) => (e.graphRelationshipOptions?.dashed ? 0.2 : 0.8))
      )
      .force("charge", d3.forceManyBody().strength(-600))
      .force("center", d3.forceCenter(1200 / 2, 800 / 2))
      .force("collision", d3.forceCollide().radius((d: any) => (d.options?.radius || 12) + 4));

    // Membership edges (solid gray)
    const memberLink = zoomGroup
      .append("g")
      .attr("stroke", "#888")
      .attr("stroke-opacity", 0.7)
      .selectAll("line")
      .data(memberEdges)
      .join("line")
      .attr("stroke-width", 2);

    // Pact edges (dashed blue)
    const pactLink = zoomGroup
      .append("g")
      .attr("stroke", "#4a90d9")
      .attr("stroke-opacity", 0.8)
      .attr("stroke-dasharray", "6,4")
      .selectAll("line")
      .data(pactEdges)
      .join("line")
      .attr("stroke-width", 1.5);

    const node = zoomGroup
      .append("g")
      .selectAll<SVGGElement, any>("g")
      .data(nodes)
      .join("g")
      .call(
        d3
          .drag<SVGGElement, any>()
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragEnded)
      );

    // Circle
    node
      .append("circle")
      .attr("r", (d) => d.options?.radius || 12)
      .attr("fill", (d) => d.color || "#69b3a2")
      .attr("stroke", (d) => (d.options?.isHub ? "#333" : "none"))
      .attr("stroke-width", (d) => (d.options?.isHub ? 2 : 0));

    // Label
    node
      .append("text")
      .text((d) => d.label)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "central")
      .attr("fill", (d) => {
        return d.color !== undefined && color(d.color)
          ? adjustColorForBackground(color(d.color)!)!
          : "#000";
      })
      .style("font-size", (d) => (d.options?.isHub ? "14px" : "11px"))
      .style("font-weight", (d) => (d.options?.isHub ? "bold" : "normal"))
      .style("font-family", "Segoe UI")
      .style("pointer-events", "none");

    // Hover highlight for all link types
    node.on("mouseover", (_, d) => {
      memberLink.attr("stroke-width", (l: any) =>
        l.source.id === d.id || l.target.id === d.id ? 4 : 2
      );
      pactLink.attr("stroke-width", (l: any) =>
        l.source.id === d.id || l.target.id === d.id ? 3 : 1.5
      );
    });
    node.on("mouseout", () => {
      memberLink.attr("stroke-width", 2);
      pactLink.attr("stroke-width", 1.5);
    });

    simulation.on("tick", () => {
      memberLink
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      pactLink
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragStarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [alliances, countries]);

  return (
    <svg
      ref={svgRef}
      width={1200}
      height={800}
      style={{ border: "1px solid #ccc", background: "#fafafa" }}
    />
  );
};
