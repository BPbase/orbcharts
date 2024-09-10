import type { DataFormatterFile } from '../types'

export const DF_SERIES_SEPARATE_SERIES: DataFormatterFile<'series'> = {
  id: 'DF_SERIES_SEPARATE_SERIES',
  chartType: 'series',
  description: '分開顯示Series',
  data: {
    separateSeries: true
  }
}