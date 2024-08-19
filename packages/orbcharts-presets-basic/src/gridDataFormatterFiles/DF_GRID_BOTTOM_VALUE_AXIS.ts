import type { DataFormatterFile } from '../types'

export const DF_GRID_BOTTOM_VALUE_AXIS: DataFormatterFile<'grid'> = {
  id: 'DF_GRID_BOTTOM_VALUE_AXIS',
  chartType: 'grid',
  description: '底部橫向資料圖軸',
  data: {
    grid: {
      valueAxis: {
        position: 'bottom'
        // position: 'top'
        // position: 'left'
        // position: 'right'
      },
      groupAxis: {
        position: 'left'
        // position: 'right'
        // position: 'bottom'
        // position: 'top'
      },
    }
  }
}