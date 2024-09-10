import type { DataFormatterFile } from '../types'

export const DF_SERIES_SUM_SERIES: DataFormatterFile<'series'> = {
  id: 'DF_SERIES_SUM_SERIES',
  chartType: 'series',
  description: '合併Series資料',
  data: {
    sumSeries: true
  }
}