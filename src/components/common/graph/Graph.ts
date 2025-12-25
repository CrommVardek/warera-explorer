export interface GraphNode {
  id: string;
  label: string;
  color?: string;
  options?: GraphNodeOptions;
  imgUrl?: string;
}

export interface GraphRelationship {
  id: string;
  source: string;
  target: string;
}

export interface GraphNodeOptions {
  radius?: number;
}
