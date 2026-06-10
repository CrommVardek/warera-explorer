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
  graphRelationshipOptions?: GraphRelationshipOptions;
}

export interface GraphNodeOptions {
  radius?: number;
  isHub?: boolean;
}

export interface GraphRelationshipOptions {
  label?: string;
  dashed?: boolean;
  color?: string;
}
