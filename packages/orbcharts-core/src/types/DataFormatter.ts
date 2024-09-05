import type { ChartType } from './Chart'
import type { ChartParams } from './ChartParams'
import type { DataTypeMap, DatumTypeMap } from './Data'
import type { ComputedDataTypeMap, ComputedDatumTypeMap } from './ComputedData'
import type { DataFormatterSeries, DataFormatterSeriesPartial } from './DataFormatterSeries'
import type { DataFormatterGrid, DataFormatterGridPartial } from './DataFormatterGrid'
import type { DataFormatterMultiGrid, DataFormatterMultiGridPartial } from './DataFormatterMultiGrid'
import type { DataFormatterMultiValue, DataFormatterMultiValuePartial } from './DataFormatterMultiValue'
import type { DataFormatterTree, DataFormatterTreePartial } from './DataFormatterTree'
import type { DataFormatterRelationship, DataFormatterRelationshipPartial } from './DataFormatterRelationship'
import type { AxisPosition } from './Axis'
import type { Layout } from './Layout'

// export type DataFormatter = DataFormatterSeries
//   | DataFormatterGrid
//   | DataFormatterMultiGrid
//   | DataFormatterMultiValue
//   | DataFormatterTree
//   | DataFormatterRelationship

// export type DataFormatterPartial = DataFormatterSeriesPartial
//   | DataFormatterGridPartial
//   | DataFormatterMultiGridPartial
//   | DataFormatterMultiValuePartial
//   | DataFormatterTreePartial
//   | DataFormatterRelationshipPartial

// dataFormatter計算當中會使用的資料
export interface DataFormatterContext<T extends ChartType> {
  data: DataTypeMap<T>
  dataFormatter: DataFormatterTypeMap<T>
  chartParams: ChartParams
  // layout: Layout
}


// 透過類型選擇DataFormatter
export type DataFormatterTypeMap<T extends ChartType> = T extends 'series' ? DataFormatterSeries
  : T extends 'grid' ? DataFormatterGrid
  : T extends 'multiGrid' ? DataFormatterMultiGrid
  : T extends 'multiValue' ? DataFormatterMultiValue
  : T extends 'relationship' ? DataFormatterRelationship
  : T extends 'tree' ? DataFormatterTree
  : DataFormatterBase<T>

// 透過類型選擇DataFormatter（可選欄位）
export type DataFormatterPartialTypeMap<T extends ChartType> = T extends 'series' ? DataFormatterSeriesPartial
  : T extends 'grid' ? DataFormatterGridPartial
  : T extends 'multiGrid' ? DataFormatterMultiGridPartial
  : T extends 'multiValue' ? DataFormatterMultiValuePartial
  : T extends 'relationship' ? DataFormatterRelationshipPartial
  : T extends 'tree' ? DataFormatterTreePartial
  : DataFormatterBasePartial<T>

// 基本介面
export interface DataFormatterBase<T extends ChartType> {
  type: T
}

export type DataFormatterBasePartial<T extends ChartType> = Partial<DataFormatterBase<T>>

// 有value
// export interface DataFormatterValue {
//   valueFormat: ValueFormat
// }

// 有axis
// export interface DataFormatterAxis {
//   // domainMinValue?: number
//   // domainMaxValue?: number
//   // domainMinRange?: number
//   // domainMaxRange?: number
//   valueDomain: [number | 'auto', number | 'auto']
//   valueRange: [number, number] // 0-1
// }

export interface DataFormatterValueAxis {
  position: AxisPosition
  scaleDomain: [number | 'auto', number | 'auto']
  scaleRange: [number, number]
  label: string
}

export interface DataFormatterGroupAxis {
  position: AxisPosition
  scaleDomain: [number | 'auto', number | 'auto']
  scalePadding: number
  label: string
}


// export type ValueFormat = string | ((text: d3.NumberValue) => string)

// export type VisibleFilter<T extends ChartType> = (datum: DatumTypeMap<T>, rowIndex: number, columnIndex: number, context: DataFormatterContext<T>) => boolean | null

export type VisibleFilter<T extends ChartType> = (datum: ComputedDatumTypeMap<T>, context: DataFormatterContext<T>) => boolean | null

// export type TooltipContentFormat<T extends ChartType> = (datum: DatumTypeMap<T>, rowIndex: number, columnIndex: number, context: DataFormatterContext<T>) => string | null
