import type { DataFormatterFile } from '../types'

export const DF_SERIES_SEPARATE_SERIES_AND_SUM_SERIES: DataFormatterFile<'series'> = {
  id: 'DF_SERIES_SEPARATE_SERIES_AND_SUM_SERIES',
  chartType: 'series',
  description: '分開顯示Series並合併Series資料',
  data: {
    separateSeries: true,
    sumSeries: true,
  }
}