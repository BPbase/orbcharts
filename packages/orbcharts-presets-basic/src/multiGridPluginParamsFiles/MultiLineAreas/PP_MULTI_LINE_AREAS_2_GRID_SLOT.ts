import type { PluginParamsFile } from '../../types'
import type { MultiLineAreasParams } from '@orbcharts/plugins-basic'

export const PP_MULTI_LINE_AREAS_2_GRID_SLOT: PluginParamsFile<MultiLineAreasParams> = {
  id: 'PP_MULTI_LINE_AREAS_2_GRID_SLOT',
  chartType: 'multiGrid',
  pluginName: 'MultiLineAreas',
  description: '2組折線圖',
  data: {
    gridIndexes: [0, 1]
  }
}