import { ComputedDatumBase, ComputedDatumBaseSeries, ComputedDatumBaseValue } from './ComputedData'

export interface ComputedDatumSeries
  extends ComputedDatumBase, ComputedDatumBaseSeries, ComputedDatumBaseValue {
  
}

export type ComputedDataSeries = ComputedDatumSeries[][]