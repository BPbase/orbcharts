import { ComputedDatumBase, ComputedDatumSeriesValue } from './ComputedData'

export interface ComputedDatumGrid
  extends ComputedDatumBase, ComputedDatumSeriesValue {
  accSeriesIndex: number // 每一個grid累加的seriesIndex
  gridIndex: number
  groupIndex: number
  groupLabel: string
  axisX: number
  axisY: number
  axisYFromZero: number
}

export type ComputedDataGrid = ComputedDatumGrid[][]