import type { PluginParamsFile } from '../../types'
import type { MultiDotsParams } from '@orbcharts/plugins-basic'

export const PP_MULTI_DOTS_2_GRID_SLOT: PluginParamsFile<MultiDotsParams> = {
  id: 'PP_MULTI_DOTS_2_GRID_SLOT',
  chartType: 'multiGrid',
  pluginName: 'MultiDots',
  description: '2組圓點',
  data: {
    gridIndexes: [0, 1]
  }
}