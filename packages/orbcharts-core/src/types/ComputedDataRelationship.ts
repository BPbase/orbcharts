import type { ComputedDatumBase } from './ComputedData'

export type ComputedDataRelationship = {
  nodes: ComputedNode[]
  edges: ComputedEdge[]
}

export interface ComputedNode extends ComputedDatumBase {
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