import type { 
  DataFormatterBase, 
  DataFormatterBasePartial, 
  DataFormatterValueAxis, 
  DataFormatterGroupAxis, 
  VisibleFilter,
  DataFormatterContainer
} from './DataFormatter'


export type SeriesDirection = 'row' | 'column' // default: 'row'

export interface DataFormatterGrid extends DataFormatterBase<'grid'> {
  visibleFilter: VisibleFilter<'grid'>
  grid: DataFormatterGridGrid
  container: DataFormatterContainer
}

export interface DataFormatterGridPartial extends DataFormatterBasePartial<'grid'> {
  visibleFilter?: VisibleFilter<'grid'>
  grid?: DataFormatterGridGridPartial
  container?: Partial<DataFormatterContainer>
}

export interface DataFormatterGridGrid {
  // gridData: DataFormatterGridGridData
  // slotIndex: number | null
  // seriesSlotIndexes: number[] | null
  seriesDirection: SeriesDirection
  rowLabels: string[]
  columnLabels: string[]
  valueAxis: DataFormatterValueAxis
  groupAxis: DataFormatterGroupAxis
  separateSeries: boolean
}

export interface DataFormatterGridGridPartial {
  // gridData?: Partial<DataFormatterGridGridData>
  // slotIndex?: number | null
  // seriesSlotIndexes?: number[] | null
  seriesDirection?: SeriesDirection
  rowLabels?: string[]
  columnLabels?: string[]
  valueAxis?: Partial<DataFormatterValueAxis>
  groupAxis?: Partial<DataFormatterGroupAxis>
  separateSeries?: boolean
}

export interface DataFormatterGridContainer {
  gap: number
  rowAmount: number
  columnAmount: number
}

// grid欄位
// export interface DataFormatterGridGridData {
//   seriesDirection: SeriesDirection
//   rowLabels: string[]
//   columnLabels: string[]
// }

// const test: DataFormatterGridPartial = {
//   type: 'grid',
//   grid: {
//     rowLabels: [],
//     // a: ''
//   }
// }