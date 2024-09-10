import type { DataFormatterFile } from '../types'

export const DF_GRID_SEPARATE_SERIES: DataFormatterFile<'grid'> = {
  id: 'DF_GRID_SEPARATE_SERIES',
  chartType: 'grid',
  description: '分開顯示Series',
  data: {
    grid: {
      // seriesSlotIndexes: [0, 1],
      separateSeries: true,
    },
    // container: {
    //   rowAmount: 1,
    //   columnAmount: 2,
    // }
  }
}