import { adjustColorForBackground } from "../../../utils/colorUtils";
import type { GraphNode, GraphRelationship } from "./Graph";
import { color, select } from "d3";

export const AddLabelsToNode = (
  nodeSelection: d3.Selection<SVGGElement, GraphNode, SVGGElement, any>
) => {
  nodeSelection
    .style("font-weight", "bold")
    .append("text")
    .text((d) => d.label)
    .attr("text-anchor", "middle") // Center horizontally
    .attr("alignment-baseline", "central") // Center vertically
    .attr("fill", (d) => {
      return d.color !== undefined && color(d.color)
        ? adjustColorForBackground(color(d.color)!)!
        : "#000";
    })
    .style("font-size", "18px")
    .style("font-family", "Segoe UI");
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
    link.attr("stroke", (l: any) =>
      (l.source.id === d.id || l.target.id === d.id) && d.color !== undefined
        ? d.color
        : "#999"
    );
  });
};

export const AddImagePatternOrCircleToNode = (
  node: d3.Selection<SVGGElement, GraphNode, SVGGElement, any>
) => {
  node.each(function (this: SVGGElement, d: GraphNode) {
    const currentNode = select(this);

    if (d.imgUrl) {
      const defs = currentNode.append("defs");
      const pattern = defs
        .append("pattern")
        .attr("id", `pattern-${d.id}`)
        .attr("height", 1)
        .attr("width", 1)
        .attr("patternContentUnits", "objectBoundingBox");

      pattern
        .append("image")
        .attr("xlink:href", d.imgUrl)
        .attr("href", d.imgUrl) // Modern browsers use 'href' instead of 'xlink:href'
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "xMidYMid slice");

      currentNode
        .append("circle")
        .attr("r", d.options?.radius || 10)
        .attr("fill", `url(#pattern-${d.id})`);
    } else {
      AddCircleToNode(node);
    }
  });
};
