import type { PluginParamsFile } from '../../types'
import type { MultiBarsParams } from '@orbcharts/plugins-basic'

export const PP_MULTI_BARS_2_GRID_SLOT: PluginParamsFile<MultiBarsParams> = {
  id: 'PP_MULTI_BARS_2_GRID_SLOT',
  chartType: 'multiGrid',
  pluginName: 'MultiBars',
  description: '2組群組長條圖',
  data: {
    gridIndexes: [0, 1]
  }
}