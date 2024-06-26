import { DataGridDatum, DataGridValue } from './DataGrid'
import { DataFormatterGridGrid } from './DataFormatterGrid'
import { DataFormatterBase, DataFormatterValueAxis, DataFormatterGroupAxis, DataFormatterContext } from './DataFormatter'
import { AxisPosition } from './Axis'

export interface DataFormatterMultiGrid
  extends DataFormatterBase<'multiGrid'> {
  multiGrid: Array<DataFormatterMultiGridMultiGrid>
  // visibleGroupRange: [number, number] | null
}

export type DataFormatterMultiGridPartial = Partial<DataFormatterMultiGrid> | Partial<{
  multiGrid: Array<Partial<DataFormatterMultiGridMultiGrid>>
}>

// multiGrid欄位
export interface DataFormatterMultiGridMultiGrid {
  grid: DataFormatterGridGrid
  valueAxis: DataFormatterValueAxis // default: 'left'
  groupAxis: DataFormatterGroupAxis // default: 'bottom'
  colorsPredicate: (datum: DataGridDatum | DataGridValue, rowIndex: number, columnIndex: number, context: DataFormatterContext<'grid'>) => string
  // colors: Colors
}