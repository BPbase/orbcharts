import type { PluginParamsFile } from '../../types'
import type { MultiBarsTriangleParams } from '@orbcharts/plugins-basic'

export const PP_MULTI_BARS_TRIANGLE_2_GRID_SLOT: PluginParamsFile<MultiBarsTriangleParams> = {
  id: 'PP_MULTI_BARS_TRIANGLE_2_GRID_SLOT',
  chartType: 'multiGrid',
  pluginName: 'MultiBarsTriangle',
  description: '2組群組三角長條圖',
  data: {
    gridIndexes: [0, 1]
  }
}