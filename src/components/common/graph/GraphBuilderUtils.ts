export const AddLabelsToNode = (
  nodeSelection: d3.Selection<SVGGElement, any, SVGGElement, any>
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
  nodeSelection: d3.Selection<SVGGElement, any, SVGGElement, any>
) => {
  nodeSelection
    .append("circle")
    .attr("r", 30)
    .attr("fill", (d) => d.color || "#69b3a2");
};
