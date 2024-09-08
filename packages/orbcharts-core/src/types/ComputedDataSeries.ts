import { ComputedDatumBase, ComputedDatumSeriesValue } from './ComputedData'

export interface ComputedDatumSeries
  extends ComputedDatumBase, ComputedDatumSeriesValue {
  
}

export type ComputedDataSeries = ComputedDatumSeries[][]