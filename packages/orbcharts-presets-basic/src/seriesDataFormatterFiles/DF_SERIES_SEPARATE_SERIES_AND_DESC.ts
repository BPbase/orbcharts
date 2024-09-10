import type { DataFormatterFile } from '../types'

export const DF_SERIES_SEPARATE_SERIES_AND_DESC: DataFormatterFile<'series'> = {
  id: 'DF_SERIES_SEPARATE_SERIES_AND_DESC',
  chartType: 'series',
  description: '分開顯示Series並排序',
  data: {
    separateSeries: true,
    sort: (a, b) => b.value - a.value
  }
}