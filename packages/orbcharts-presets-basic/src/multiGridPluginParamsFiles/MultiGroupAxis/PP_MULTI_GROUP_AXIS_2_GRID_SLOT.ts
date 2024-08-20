import type { PluginParamsFile } from '../../types'
import type { MultiGroupAxisParams } from '@orbcharts/plugins-basic'

export const PP_MULTI_GROUP_AXIS_2_GRID_SLOT: PluginParamsFile<MultiGroupAxisParams> = {
  id: 'PP_MULTI_GROUP_AXIS_2_GRID_SLOT',
  chartType: 'multiGrid',
  pluginName: 'MultiGroupAxis',
  description: '2個群組圖軸',
  data: {
    tickTextRotate: -30,
    gridIndexes: [0, 1]
  }
}