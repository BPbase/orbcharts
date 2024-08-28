import type { DatumBase } from './Data'

export type DataTree = DataTreeObj | DataTreeDatum[]

// 樹狀結構
export interface DataTreeObj extends DatumBase {
  id: string
  value?: number
  children?: DataTreeObj[]
  categoryLabel?: string
}

// 陣列資料
export interface DataTreeDatum extends DatumBase {
  id: string
  value?: number
  parent?: string
  categoryLabel?: string
}

