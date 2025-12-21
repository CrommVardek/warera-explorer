import type { GraphNode, GraphRelationship } from "./Graph";

export const AddLabelsToNode = (
  nodeSelection: d3.Selection<SVGGElement, GraphNode, SVGGElement, any>
) => {
  nodeSelection
    .style("font-weight", "bold")
    .append("text")
    .text((d) => d.label)
    .attr("x", 18)
    .attr("y", 4)
    .style("font-size", "16px")
    .style("font-family", "sans-serif");
};

export const AddCircleToNode = (
  nodeSelection: d3.Selection<SVGGElement, GraphNode, SVGGElement, any>
) => {
  nodeSelection
    .append("circle")
    .attr("r", (d) => (d.options && d.options.radius ? d.options.radius : 15))
    .attr("fill", (d) => d.color || "#69b3a2");
};

export const HighlightLinksOnHover = (
  nodeSelection: d3.Selection<SVGGElement, GraphNode, SVGGElement, any>,
  link: d3.Selection<
    d3.BaseType | SVGLineElement,
    GraphRelationship,
    SVGGElement,
    unknown
  >
) => {
  nodeSelection.on("mouseover", (_, d) => {
    link.attr("stroke-width", (l: any) =>
      l.source.id === d.id || l.target.id === d.id ? 5 : 2
    );
  });
};
