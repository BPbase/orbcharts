import type { DataFormatterFile } from '../types'

export const DF_LINE_AREAS_4_SERIES_SLOT: DataFormatterFile<'grid'> = {
  id: 'DF_LINE_AREAS_4_SERIES_SLOT',
  chartType: 'grid',
  description: 'LineAreas 4個Series Slot',
  data: {
    grid: {
      // seriesSlotIndexes: [0, 1, 2, 3],
      separateSeries: true,
      groupAxis: {
        scalePadding: 0
      }
    },
    container: {
      rowAmount: 2,
      columnAmount: 2,
    }
  }
}