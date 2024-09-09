import type { VisibleFilter, DataFormatterContainer } from './DataFormatter'
import type { DataFormatterGridGrid, DataFormatterGridGridPartial } from './DataFormatterGrid'
import type {
  DataFormatterBase,
  DataFormatterBasePartial,
  DataFormatterValueAxis,
  DataFormatterGroupAxis,
  DataFormatterContext } from './DataFormatter'
import type { AxisPosition } from './Axis'

export interface DataFormatterMultiGrid extends DataFormatterBase<'multiGrid'> {
  visibleFilter: VisibleFilter<'multiGrid'>
  gridList: Array<DataFormatterGridGrid>
  container: DataFormatterMultiGridContainer
  separateGrid: boolean
}

export interface DataFormatterMultiGridPartial extends DataFormatterBasePartial<'multiGrid'> {
  // visibleFilter?: VisibleFilter<'multiGrid'>
  gridList?: Array<DataFormatterGridGridPartial>
  container?: Partial<DataFormatterMultiGridContainer>
  separateGrid?: boolean
}

export interface DataFormatterMultiGridGrid extends DataFormatterGridGrid {

}

export interface DataFormatterMultiGridGridPartial extends DataFormatterGridGridPartial {

}

// container
export interface DataFormatterMultiGridContainer extends DataFormatterContainer {

}

// multiGrid欄位
// export interface DataFormatterMultiGridMultiGrid {
//   grid: DataFormatterGridGridData
//   valueAxis: DataFormatterValueAxis // default: 'left'
//   groupAxis: DataFormatterGroupAxis // default: 'bottom'
//   colorsPredicate: (datum: DataGridDatum | DataGridValue, rowIndex: number, columnIndex: number, context: DataFormatterContext<'grid'>) => string
//   // colors: Colors
// }