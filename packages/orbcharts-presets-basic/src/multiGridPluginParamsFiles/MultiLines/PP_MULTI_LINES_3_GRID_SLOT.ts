import type { PluginParamsFile } from '../../types'
import type { MultiLinesParams } from '@orbcharts/plugins-basic'

export const PP_MULTI_LINES_3_GRID_SLOT: PluginParamsFile<MultiLinesParams> = {
  id: 'PP_MULTI_LINES_3_GRID_SLOT',
  chartType: 'multiGrid',
  pluginName: 'MultiLines',
  description: '3組折線圖',
  data: {
    gridIndexes: [0, 1, 2]
  }
}