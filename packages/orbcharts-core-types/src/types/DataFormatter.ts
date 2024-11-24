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
import type { ValidatorResult } from './Validator'

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

export interface DataFormatterValueAxis {
  position: AxisPosition
  // scaleDomain說明
  // [0] => min: 最小值, 'auto': 取最小值，但若大於0則保持為0
  // [1] => max: 最大值, 'auto': 取最大值，但若小於0則保持為0
  scaleDomain: [number | 'min' | 'auto', number | 'max' | 'auto']
  scaleRange: [number, number]
  label: string
}

export interface DataFormatterGroupAxis {
  position: AxisPosition
  scaleDomain: [number, number | 'max']
  scalePadding: number
  label: string
}


// export type ValueFormat = string | ((text: d3.NumberValue) => string)

export type VisibleFilter<T extends ChartType> = (datum: ComputedDatumTypeMap<T>, context: DataFormatterContext<T>) => boolean | null

// export type TooltipContentFormat<T extends ChartType> = (datum: DatumTypeMap<T>, rowIndex: number, columnIndex: number, context: DataFormatterContext<T>) => string | null

export interface DataFormatterContainer {
  gap: number
  rowAmount: number
  columnAmount: number
}

export type DataFormatterValidator<T extends ChartType> = (dataFormatter: DataFormatterPartialTypeMap<T>) => ValidatorResult