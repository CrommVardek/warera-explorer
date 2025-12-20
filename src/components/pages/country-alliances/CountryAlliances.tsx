import { useEffect, useRef } from "react";
import * as d3 from "d3";

import type { Country } from "../../../models/country/Country";
import { buildAllianceGraph } from "../../../services/CountryAlliancesService";
import { AddCircleToNode, AddLabelsToNode } from "../../common/graph/GraphBuilderUtils";

interface CountryAlliancesProps { countries: Country[] }

export const CountryAlliances = ({ countries }: CountryAlliancesProps) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    const zoomGroupRef = useRef<SVGGElement | null>(null);

    useEffect(() => {
        const { nodes, edges } = buildAllianceGraph(countries);

        const svg = d3.select<SVGSVGElement, unknown>(svgRef.current!);
        svg.selectAll("*").remove(); // clear previous graph

        const zoomGroup = svg.append("g");

        // Set up zoom behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4])
            .on("zoom", (event) => {
                zoomGroup.attr("transform", event.transform.toString());
            });

        svg.call(zoom);

        const simulation = d3
            .forceSimulation(nodes as any)
            .force("link", d3.forceLink(edges as any).id((d: any) => d.id).distance(120))
            .force("charge", d3.forceManyBody().strength(-1000))
            .force("center", d3.forceCenter(1200 / 2, 800 / 2));

        // Lines for alliances
        const link = zoomGroup
            .append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(edges)
            .join("line")
            .attr("stroke-width", 2);

        // Node group (circle + label)
        const node = zoomGroup
            .append("g")
            .selectAll<SVGGElement, any>("g")
            .data(nodes)
            .join("g")
            .call(
                d3.drag<SVGGElement, any>()
                    .on("start", dragStarted)
                    .on("drag", dragged)
                    .on("end", dragEnded)
            );


        AddCircleToNode(node);

        AddLabelsToNode(node);

        // Update positions each tick
        simulation.on("tick", () => {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        });

        // Drag handlers
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
            simulation.stop();  // <-- THIS is the correct cleanup
        }
    }, [countries]);

    return (
        <svg
            ref={svgRef}
            width={1200}
            height={800}
            style={{ border: "1px solid #ccc", background: "#fafafa" }}
        >
            <g ref={zoomGroupRef} />
        </svg>
    );
}
