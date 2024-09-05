import type { DataGridDatum, DataGridValue } from './DataGrid'
import type { DataFormatterBase, DataFormatterBasePartial, DataFormatterValueAxis, DataFormatterGroupAxis, VisibleFilter } from './DataFormatter'
// import type { AxisPosition } from './Axis'

export type SeriesDirection = 'row' | 'column' // default: 'row'

export interface DataFormatterGrid extends DataFormatterBase<'grid'> {
  visibleFilter: VisibleFilter<'grid'>
  grid: DataFormatterGridGrid
  container: DataFormatterGridContainer
  // visibleGroupRange: [number, number] | null
  // colorsPredicate: (datum: DataGridDatum | DataGridValue, rowIndex: number, columnIndex: number, context: DataFormatterContext<'grid'>) => string
}

export interface DataFormatterGridPartial extends DataFormatterBasePartial<'grid'> {
  visibleFilter?: VisibleFilter<'grid'>
  grid?: DataFormatterGridGridPartial
  container?: Partial<DataFormatterGridContainer>
}

export interface DataFormatterGridGrid {
  gridData: DataFormatterGridGridData
  valueAxis: DataFormatterValueAxis
  groupAxis: DataFormatterGroupAxis
  slotIndex: number | null
  seriesSlotIndexes: number[] | null
}

export interface DataFormatterGridGridPartial {
  gridData?: Partial<DataFormatterGridGridData>
  valueAxis?: Partial<DataFormatterValueAxis>
  groupAxis?: Partial<DataFormatterGroupAxis>
  slotIndex?: number | null
  seriesSlotIndexes?: number[] | null
}

export interface DataFormatterGridContainer {
  gap: number
  rowAmount: number
  columnAmount: number
}

// grid欄位
export interface DataFormatterGridGridData {
  seriesDirection: SeriesDirection
  rowLabels: string[]
  columnLabels: string[]
}

// const test: DataFormatterGridPartial = {
//   type: 'grid',
//   grid: {
//     rowLabels: [],
//     // a: ''
//   }
// }