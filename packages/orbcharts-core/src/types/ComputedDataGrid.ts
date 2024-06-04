import { ComputedDatumBase, ComputedDatumSeriesValue } from './ComputedData'

export interface ComputedDatumGrid
  extends ComputedDatumBase, ComputedDatumSeriesValue {
  groupIndex: number
  groupLabel: string
  axisX: number
  axisY: number
  axisYFromZero: number
}

export type ComputedDataGrid = ComputedDatumGrid[][]