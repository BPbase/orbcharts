import type { DataFormatterFile } from '../types'
import type { BarsParams } from '@orbcharts/plugins-basic'

export const DF_BOTTOM_VALUE_AXIS: DataFormatterFile<'grid'> = {
  id: 'DF_BOTTOM_VALUE_AXIS',
  chartType: 'grid',
  description: '底部橫向資料圖軸',
  data: {
    valueAxis: {
      position: 'bottom'
    },
    groupAxis: {
      position: 'left'
    },
  }
}