import type { VisibleFilter } from './DataFormatter'
import type { DataFormatterGrid } from './DataFormatterGrid'
import type {
  DataFormatterBase,
  DataFormatterBasePartial,
  DataFormatterValueAxis,
  DataFormatterGroupAxis,
  DataFormatterContext } from './DataFormatter'
import type { AxisPosition } from './Axis'

export interface DataFormatterMultiGrid extends DataFormatterBase<'multiGrid'> {
  visibleFilter: VisibleFilter<'multiGrid'>
  multiGrid: Array<DataFormatterMultiGridMultiGrid>
  // visibleGroupRange: [number, number] | null
  container: DataFormatterMultiGridContainer
}

export interface DataFormatterMultiGridPartial extends DataFormatterBasePartial<'multiGrid'> {
  multiGrid?: Array<Partial<DataFormatterMultiGridMultiGrid>>
}

// 比grid還多出來的額外參數
export interface DataFormatterMultiGridMultiGrid extends DataFormatterGrid {
  slotIndex: number
}

// container
export interface DataFormatterMultiGridContainer {
  gap: number
  rowAmount: number
  columnAmount: number
}

// multiGrid欄位
// export interface DataFormatterMultiGridMultiGrid {
//   grid: DataFormatterGridGrid
//   valueAxis: DataFormatterValueAxis // default: 'left'
//   groupAxis: DataFormatterGroupAxis // default: 'bottom'
//   colorsPredicate: (datum: DataGridDatum | DataGridValue, rowIndex: number, columnIndex: number, context: DataFormatterContext<'grid'>) => string
//   // colors: Colors
// }