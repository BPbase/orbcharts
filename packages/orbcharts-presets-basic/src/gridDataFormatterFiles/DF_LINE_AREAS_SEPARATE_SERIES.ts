import type { DataFormatterFile } from '../types'

export const DF_LINE_AREAS_SEPARATE_SERIES: DataFormatterFile<'grid'> = {
  id: 'DF_LINE_AREAS_SEPARATE_SERIES',
  chartType: 'grid',
  description: 'LineAreas 分開顯示Series',
  data: {
    grid: {
      // seriesSlotIndexes: [0, 1],
      separateSeries: true,
      groupAxis: {
        scalePadding: 0
      }
    },
    // container: {
    //   rowAmount: 1,
    //   columnAmount: 2,
    // }
  }
}