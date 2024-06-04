import { ComputedDatumBase, ComputedDatumSeriesValue } from './ComputedData'

export interface ComputedDatumSeries
  extends ComputedDatumBase, ComputedDatumSeriesValue {
  sortedIndex: number
}

export type ComputedDataSeries = ComputedDatumSeries[]