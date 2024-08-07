import type { PluginParamsFile } from '../../types'
import type { GridLegendParams } from '@orbcharts/plugins-basic'

export const PP_GRID_LEGEND_BOTTOM: PluginParamsFile<GridLegendParams> = {
  id: 'PP_GRID_LEGEND_BOTTOM',
  chartType: 'grid',
  pluginName: 'GridLegend',
  description: '底部圖例',
  data: {
    position: 'bottom',
    justify: 'center',
    padding: 14,
  }
}