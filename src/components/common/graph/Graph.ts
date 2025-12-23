export interface GraphNode {
  id: string;
  label: string;
  color?: string;
  options?: GraphNodeOptions;
}

export interface GraphRelationship {
  id: string;
  source: string;
  target: string;
}

export interface GraphNodeOptions {
  radius?: number;
}
