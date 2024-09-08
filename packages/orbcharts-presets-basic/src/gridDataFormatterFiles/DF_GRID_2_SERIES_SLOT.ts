import type { DataFormatterFile } from '../types'

export const DF_GRID_2_SERIES_SLOT: DataFormatterFile<'grid'> = {
  id: 'DF_GRID_2_SERIES_SLOT',
  chartType: 'grid',
  description: '2個Series Slot',
  data: {
    grid: {
      // seriesSlotIndexes: [0, 1],
      separateSeries: true,
    },
    container: {
      rowAmount: 1,
      columnAmount: 2,
    }
  }
}