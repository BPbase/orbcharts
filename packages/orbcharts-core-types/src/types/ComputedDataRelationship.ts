import type { ComputedDatumBase, ComputedDatumBaseCategory, ComputedDatumBaseValue } from './ComputedData'

export type ComputedDataRelationship = {
  nodes: ComputedNode[]
  edges: ComputedEdge[]
}

export interface ComputedNode extends ComputedDatumBase, ComputedDatumBaseCategory, ComputedDatumBaseValue {
  // startNodes: ComputedNode[]
  // startNodeIds: string[]
  // endNodes: ComputedNode[]
  // endNodeIds: string[]
}

export interface ComputedEdge extends ComputedDatumBase, ComputedDatumBaseCategory, ComputedDatumBaseValue {
  startNode: ComputedNode
  // startNodeId: string
  endNode: ComputedNode
  // endNodeId: string
}