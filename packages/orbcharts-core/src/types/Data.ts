import { ChartType } from './Chart'
import { DataSeries, DataSeriesDatum, DataSeriesValue } from './DataSeries'
import { DataGrid, DataGridDatum, DataGridValue } from './DataGrid'
import { DataMultiGrid, DataMultiGridDatum, DataMultiGridValue } from './DataMultiGrid'
import { DataMultiValue, DataMultiValueDatum, DataMultiValueValue } from './DataMultiValue'
import { DataTree, DataTreeDatum, DataTreeObj } from './DataTree'
import { DataRelationship, Node, Edge } from './DataRelationship'

// 基本欄位（皆為可選，無填寫則在 formatXX 程式中產生預設值）
export interface DatumBase {
  id?: string
  label?: string
  tooltipContent?: string
  data?: any // 使用者注入的資料
}

// 需具備value的datum
export interface DatumValue {
  value: number | null
}

// 透過類型選擇Data
export type DataTypeMap<T extends ChartType> = T extends 'series' ? DataSeries
  : T extends 'grid' ? DataGrid
  : T extends 'multiGrid' ? DataMultiGrid
  : T extends 'multiValue' ? DataMultiValue
  : T extends 'relationship' ? DataRelationship
  : T extends 'tree' ? DataTree
  : unknown

// 透過類型選擇Datum
export type DatumTypeMap<T extends ChartType> = T extends 'series' ? DataSeriesDatum | DataSeriesValue
: T extends 'grid' ? DataGridDatum | DataGridValue
: T extends 'multiGrid' ? DataMultiGridDatum | DataMultiGridValue
: T extends 'multiValue' ? DataMultiValueDatum | DataMultiValueValue
: T extends 'relationship' ? Node | Edge
: T extends 'tree' ? DataTreeDatum | DataTreeObj
: unknown

// export type Data = DataSeries
//   | DataGrid
//   | DataMultiGrid
//   | DataMultiValue
//   | DataTree
//   | DataRelationship
