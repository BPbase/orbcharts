import type { PluginParamsFile } from '../../types'
import type { MultiGroupAxisParams } from '@orbcharts/plugins-basic'

export const PP_MULTI_GROUP_AXIS_DIVERGING: PluginParamsFile<MultiGroupAxisParams> = {
  id: 'PP_MULTI_GROUP_AXIS_DIVERGING',
  chartType: 'multiGrid',
  pluginName: 'MultiGroupAxis',
  description: '分向Gird群組圖軸',
  data: {
    tickPadding: 60, // 加長間距
    gridIndexes: [0] // 只顯示一個
  }
}