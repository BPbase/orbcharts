import type { DataFormatterFile } from '../types'

export const DF_GRID_NONE_GROUP_SCALE_PADDING: DataFormatterFile<'grid'> = {
  id: 'DF_GRID_NONE_GROUP_SCALE_PADDING',
  chartType: 'grid',
  description: '無群組圖軸的左右間距',
  data: {
    grid: {
      groupAxis: {
        scalePadding: 0
      }
    }
  }
}