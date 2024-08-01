import { Node, Edge, DataRelationship } from './DataRelationship'
import { DataFormatterBase } from './DataFormatter'

export interface DataFormatterRelationship
  extends DataFormatterBase<'relationship'> {
  // node: DataFormatterRelationshipNode
  // edge: DataFormatterRelationshipEdge
}

export type DataFormatterRelationshipPartial = Partial<DataFormatterRelationship> & Partial<{
  // node: Partial<DataFormatterRelationshipNode>
  // edge: Partial<DataFormatterRelationshipEdge>
}>

// export interface DataFormatterRelationshipNode {
//   labelFormat: (node: unknown) => string
//   descriptionFormat: (node: unknown) => string
// }

// export interface DataFormatterRelationshipEdge {
//   labelFormat: (edge: unknown, startNode: unknown, endNode: unknown) => string
//   descriptionFormat: (edge: unknown, startNode: unknown, endNode: unknown) => string
// }