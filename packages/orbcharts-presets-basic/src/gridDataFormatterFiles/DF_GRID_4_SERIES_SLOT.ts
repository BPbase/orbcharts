import type { DataFormatterFile } from '../types'

export const DF_GRID_4_SERIES_SLOT: DataFormatterFile<'grid'> = {
  id: 'DF_GRID_4_SERIES_SLOT',
  chartType: 'grid',
  description: '4個Series Slot',
  data: {
    grid: {
      // seriesSlotIndexes: [0, 1, 2, 3],
      separateSeries: true,
    },
    container: {
      rowAmount: 2,
      columnAmount: 2,
    }
  }
}