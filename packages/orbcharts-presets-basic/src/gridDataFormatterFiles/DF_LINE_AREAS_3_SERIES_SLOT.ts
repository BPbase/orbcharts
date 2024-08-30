import type { DataFormatterFile } from '../types'

export const DF_LINE_AREAS_3_SERIES_SLOT: DataFormatterFile<'grid'> = {
  id: 'DF_LINE_AREAS_3_SERIES_SLOT',
  chartType: 'grid',
  description: 'LineAreas 3個Series Slot',
  data: {
    grid: {
      seriesSlotIndexes: [0, 1, 2],
      groupAxis: {
        scalePadding: 0
      }
    },
    container: {
      rowAmount: 1,
      columnAmount: 3,
    }
  }
}