import type { DataFormatterFile } from '../types'

export const DF_GRID_BOTTOM_VALUE_AXIS_AND_NONE_GROUP_SCALE_PADDING: DataFormatterFile<'grid'> = {
  id: 'DF_GRID_BOTTOM_VALUE_AXIS_AND_NONE_GROUP_SCALE_PADDING',
  chartType: 'grid',
  description: '底部橫向資料圖軸及無群組圖軸的左右間距',
  data: {
    grid: {
      valueAxis: {
        position: 'bottom'
      },
      groupAxis: {
        position: 'left',
        scalePadding: 0
      },
    }
  }
}