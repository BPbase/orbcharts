import type { DataFormatterFile } from '../types'

export const DF_GRID_3_SERIES_SLOT: DataFormatterFile<'grid'> = {
  id: 'DF_GRID_3_SERIES_SLOT',
  chartType: 'grid',
  description: '3個Series Slot',
  data: {
    grid: {
      seriesSlotIndexes: [0, 1, 2],
    },
    container: {
      rowAmount: 1,
      columnAmount: 3,
    }
  }
}