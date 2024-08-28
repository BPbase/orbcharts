import type { ComputedDatumBase, ComputedDatumCategoryValue } from './ComputedData'

export type ComputedDataMultiValue = ComputedDatumMultiValue[][]

export interface ComputedDatumMultiValue extends ComputedDatumBase, ComputedDatumCategoryValue {
  axis: number
}


