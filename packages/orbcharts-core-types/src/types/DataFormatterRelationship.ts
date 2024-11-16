import { Node, Edge, DataRelationship } from './DataRelationship'
import { DataFormatterBase, DataFormatterBasePartial, VisibleFilter } from './DataFormatter'

export interface DataFormatterRelationship extends DataFormatterBase<'relationship'> {
  visibleFilter: VisibleFilter<'relationship'>
  categoryLabels: string[]
  // node: DataFormatterRelationshipNode
  // edge: DataFormatterRelationshipEdge
}

export interface DataFormatterRelationshipPartial extends DataFormatterBasePartial<'relationship'> {
  visibleFilter?: VisibleFilter<'relationship'>
  categoryLabels?: string[]
  // node: Partial<DataFormatterRelationshipNode>
  // edge: Partial<DataFormatterRelationshipEdge>
}

// export interface DataFormatterRelationshipNode {
//   labelFormat: (node: unknown) => string
//   descriptionFormat: (node: unknown) => string
// }

// export interface DataFormatterRelationshipEdge {
//   labelFormat: (edge: unknown, startNode: unknown, endNode: unknown) => string
//   descriptionFormat: (edge: unknown, startNode: unknown, endNode: unknown) => string
// }