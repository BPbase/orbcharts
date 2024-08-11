import type { PluginParamsFile } from '../../types'
import type { GridLegendParams } from '@orbcharts/plugins-basic'

export const PP_MULTI_GRID_LEGEND_BOTTOM: PluginParamsFile<GridLegendParams> = {
  id: 'PP_MULTI_GRID_LEGEND_BOTTOM',
  chartType: 'multiGrid',
  pluginName: 'MultiGridLegend',
  description: '底部圖例',
  data: {
    position: 'bottom',
    justify: 'center',
    padding: 14,
  }
}