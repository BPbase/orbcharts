import type { DataFormatterFile } from '../types'

export const DF_SERIES_SUM_SERIES_AND_DESC: DataFormatterFile<'series'> = {
  id: 'DF_SERIES_SUM_SERIES_AND_DESC',
  chartType: 'series',
  description: '合併Series資料並排序',
  data: {
    sumSeries: true,
    sort: (a, b) => b.value - a.value
  }
}