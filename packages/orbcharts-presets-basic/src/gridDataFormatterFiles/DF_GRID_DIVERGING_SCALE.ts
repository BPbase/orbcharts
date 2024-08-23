import type { DataFormatterFile } from '../types'

export const DF_GRID_DIVERGING_SCALE: DataFormatterFile<'grid'> = {
  id: 'DF_GRID_DIVERGING_SCALE',
  chartType: 'grid',
  description: '分向資料圖軸',
  data: {
    grid: {
      valueAxis: {
        scaleDomain: ['auto', 'auto'],
        scaleRange: [0.05, 0.95],
      },
    }
  }
}