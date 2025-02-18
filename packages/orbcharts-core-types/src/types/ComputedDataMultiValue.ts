import type { ComputedDatumBase, ComputedDatumBaseCategory, ComputedDatumBaseMultiValue } from './ComputedData'

export type ComputedDataMultiValue = ComputedDatumMultiValue[][]

export interface ComputedDatumMultiValue extends ComputedDatumBase, ComputedDatumBaseCategory, ComputedDatumBaseMultiValue {
  datumIndex: number
  value: number[]
}


