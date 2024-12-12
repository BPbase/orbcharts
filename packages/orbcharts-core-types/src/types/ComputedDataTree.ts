import type { ComputedDatumBase, ComputedDatumBaseCategory, ComputedDatumBaseValue } from './ComputedData'

// export type ComputedDataTree = ComputedDataTreeDatum[]

// export interface ComputedDataTreeDatum extends ComputedDatum {
//   // id: string
//   children: ComputedDataTreeDatum[]
//   childrenIds: string[]
// //   ChildrenMap: Map<string, ComputedDataTreeDatum>
//   parent: ComputedDataTreeDatum
//   parentId: string
//   value?: number
// }

// 樹狀結構
export interface ComputedDataTree extends ComputedDatumBase, ComputedDatumBaseCategory, ComputedDatumBaseValue {
  level: number
  seq: number
  children?: ComputedDataTree[]
}