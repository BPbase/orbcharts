import type { DataFormatterFile } from '../types'

export const DF_SERIES_DESC: DataFormatterFile<'series'> = {
  id: 'DF_SERIES_DESC',
  chartType: 'series',
  description: '資料由大到小排序',
  data: {
    sort: (a, b) => b.value - a.value
  }
}