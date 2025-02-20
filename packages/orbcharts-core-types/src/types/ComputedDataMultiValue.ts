import type { ComputedDatumBase, ComputedDatumBaseCategory, ComputedDatumBaseMultiValue } from './ComputedData'

export type ComputedDataMultiValue = ComputedDatumMultiValue[][]

export interface ComputedDatumMultiValue extends ComputedDatumBase, ComputedDatumBaseCategory, ComputedDatumBaseMultiValue {
  datumIndex: number
  xValueIndex: number
  yValueIndex: number
  value: (number | null)[]
  _visibleValue: (number | null)[] // 有顯示出來的值（用於tooltip）
}

export interface ComputedDatumWithSumMultiValue extends ComputedDatumMultiValue {
  sum: number
}
