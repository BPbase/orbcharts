import type { PluginParamsFile } from '../../types'
import type { MultiBarsParams } from '@orbcharts/plugins-basic'

export const PP_MULTI_BAR_STACK_4_GRID_SLOT: PluginParamsFile<MultiBarsParams> = {
  id: 'PP_MULTI_BAR_STACK_4_GRID_SLOT',
  chartType: 'multiGrid',
  pluginName: 'MultiBarStack',
  description: '4組堆疊長條圖',
  data: {
    gridIndexes: [0, 1, 2, 3]
  }
}