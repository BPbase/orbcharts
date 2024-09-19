import type { PluginParamsFile } from '../../types'
import type { MultiGroupAxisParams } from '@orbcharts/plugins-basic'

export const PP_MULTI_VALUE_STACK_AXIS_2_GRID_SLOT: PluginParamsFile<MultiGroupAxisParams> = {
  id: 'PP_MULTI_VALUE_STACK_AXIS_2_GRID_SLOT',
  chartType: 'multiGrid',
  pluginName: 'MultiValueStackAxis',
  description: '2個資料堆疊圖軸',
  data: {
    gridIndexes: [0, 1]
  }
}