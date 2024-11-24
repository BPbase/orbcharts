import type { ComputedDatumBase, ComputedDatumCategoryValue } from './ComputedData'

export type ComputedDataRelationship = {
  nodes: ComputedNode[]
  edges: ComputedEdge[]
}

export interface ComputedNode extends ComputedDatumBase, ComputedDatumCategoryValue {
  startNodes: ComputedNode[]
  startNodeIds: string[]
  endNodes: ComputedNode[]
  endNodeIds: string[]
}

export interface ComputedEdge extends ComputedDatumBase {
  startNode: ComputedNode
  startNodeId: string
  endNode: ComputedNode
  endNodeId: string
}