export interface GraphNode {
  id: string;
  label: string;
}

export interface GraphRelationship {
  id: string;
  source: string;
  target: string;
}
