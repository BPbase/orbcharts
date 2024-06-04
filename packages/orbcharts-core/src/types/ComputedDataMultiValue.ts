import type { ComputedDatumBase } from './ComputedData'

export type ComputedDataMultiValue = ComputedDatumMultiValue[][]

export interface ComputedDatumMultiValue
  extends ComputedDatumBase {
  axis: number
}


