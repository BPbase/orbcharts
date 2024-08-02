import type { DataGridDatum, DataGridValue } from './DataGrid'
import type { DataFormatterBase, DataFormatterBasePartial, DataFormatterValueAxis, DataFormatterGroupAxis, DataFormatterContext } from './DataFormatter'
// import type { AxisPosition } from './Axis'

export type SeriesType = 'row' | 'column' // default: 'row'

export interface DataFormatterGrid extends DataFormatterBase<'grid'> {
  grid: DataFormatterGridGrid
  valueAxis: DataFormatterValueAxis
  groupAxis: DataFormatterGroupAxis
  // visibleGroupRange: [number, number] | null
  colorsPredicate: (datum: DataGridDatum | DataGridValue, rowIndex: number, columnIndex: number, context: DataFormatterContext<'grid'>) => string
}

export interface DataFormatterGridPartial extends DataFormatterBasePartial<'grid'> {
  grid?: Partial<DataFormatterGridGrid>
  valueAxis?: Partial<DataFormatterValueAxis>
  groupAxis?: Partial<DataFormatterGroupAxis>
  colorsPredicate?: (datum: DataGridDatum | DataGridValue, rowIndex: number, columnIndex: number, context: DataFormatterContext<'grid'>) => string
}

// grid欄位
export interface DataFormatterGridGrid {
  // labelFormat: (datum: DataGridDatum) => string
  // rowUnitLabel: string
  rowLabels: string[]
  // rowLabelFormat: string | ((text: any) => string)
  // columnUnitLabel: string
  columnLabels: string[]
  // columnLabelFormat: string | ((text: any) => string)
  seriesType: SeriesType
}

// const test: DataFormatterGridPartial = {
//   type: 'grid',
//   grid: {
//     rowLabels: [],
//     // a: ''
//   }
// }