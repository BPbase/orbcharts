import type { ChartType } from './Chart'
import type { ComputedDataSeries, ComputedDatumSeries } from './ComputedDataSeries'
import type { ComputedDataGrid, ComputedDatumGrid } from './ComputedDataGrid'
import type { ComputedDataMultiGrid } from './ComputedDataMultiGrid'
import type { ComputedDataMultiValue, ComputedDatumMultiValue } from './ComputedDataMultiValue'
import type { ComputedDataRelationship, ComputedNode } from './ComputedDataRelationship'
import type { ComputedDataTree } from './ComputedDataTree'
import type { DataFormatterContext } from './DataFormatter'

export interface ComputedDataFn<T extends ChartType> {
  (dataFormatterContext: DataFormatterContext<T>): ComputedDataTypeMap<T>
}

// datum - 基本型本
export interface ComputedDatumBase {
  id: string
  index: number
  label: string
  // value: number | null
  visible: boolean
  description: string
  data: any // 使用者注入的資料
}

// datum - 單值
// export interface ComputedDatumValue {
//   value: number | null
//   // valueLabel: string
// }

// datum - 多值
// export interface ComputedDatumMultiValue {
//   value: number[]
//   valueLabels: string[]
// }

// datum - 圖軸
// export interface ComputedDatumWithAxis {
//   axisX: number
//   axisY: number
// }

export interface ComputedDatumBaseValue {
  value: number | null
}

export interface ComputedDatumBaseMultiValue {
  value: (number | null)[]
}

// datum - 序列資料
export interface ComputedDatumBaseSeries {
  color: string
  seriesIndex: number
  seriesLabel: string
  seq: number
}

// datum - 矩陣資料
export interface ComputedDatumBaseGrid {
  gridIndex: number
  color: string
  seriesIndex: number
  seriesLabel: string
  groupIndex: number
  groupLabel: string
}

// datum - 類別資料
export interface ComputedDatumBaseCategory {
  color: string
  categoryIndex: number
  categoryLabel: string
}

// 透過類型選擇ComputedData
export type ComputedDataTypeMap<T extends ChartType> = T extends 'series' ? ComputedDataSeries
  : T extends 'grid' ? ComputedDataGrid
  : T extends 'multiGrid' ? ComputedDataMultiGrid
  : T extends 'multiValue' ? ComputedDataMultiValue
  : T extends 'relationship' ? ComputedDataRelationship
  : T extends 'tree' ? ComputedDataTree
  : ComputedDatumBase

// 透過類型選擇ComputedDatum
export type ComputedDatumTypeMap<T extends ChartType> = T extends 'series' ? ComputedDatumSeries
: T extends 'grid' ? ComputedDatumGrid
: T extends 'multiGrid' ? ComputedDatumGrid
: T extends 'multiValue' ? ComputedDatumMultiValue
: T extends 'relationship' ? ComputedNode
: T extends 'tree' ? ComputedDataTree
: unknown

