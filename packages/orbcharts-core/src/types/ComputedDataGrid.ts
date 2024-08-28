import { ComputedDatumBase, ComputedDatumGridValue } from './ComputedData'

export interface ComputedDatumGrid
  extends ComputedDatumBase, ComputedDatumGridValue {
  // accSeriesIndex: number // 每一個grid累加的seriesIndex
  // gridIndex: number
  // groupIndex: number
  // groupLabel: string
  axisX: number
  axisY: number
  axisYFromZero: number
}

export type ComputedDataGrid = ComputedDatumGrid[][]