import type { PluginParamsFile } from '../../types'
import type { MultiValueAxisParams } from '@orbcharts/plugins-basic'

export const PP_MULTI_VALUE_STACK_AXIS_3_GRID_SLOT: PluginParamsFile<MultiValueAxisParams> = {
  id: 'PP_MULTI_VALUE_STACK_AXIS_3_GRID_SLOT',
  chartType: 'multiGrid',
  pluginName: 'MultiValueStackAxis',
  description: '3個資料堆疊圖軸',
  data: {
    gridIndexes: [0, 1, 2]
  }
}