import type { DatumBase } from './Data'

export type DataRelationship = DataRelationshipObj | DataRelationshipList

// 物件資料
export interface DataRelationshipObj {
  nodes: Node[]
  edges: Edge[]
}

// 陣列資料
export type DataRelationshipList = [
  Node[],
  Edge[]
]


export interface Node extends DatumBase {
  id: string
  value?: number
  categoryLabel?: string
}

export interface Edge extends DatumBase {
  start: string
  end: string
  value?: number
  categoryLabel?: string
}