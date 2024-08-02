import type { PluginParamsFile } from '../../types'
import type { GridLegendParams } from '@orbcharts/plugins-basic'

export const PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST: PluginParamsFile<GridLegendParams> = {
  id: 'PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST',
  chartType: 'grid',
  pluginName: 'GridLegend',
  description: '底部圖例及線條列點',
  data: {
    position: 'bottom',
    justify: 'center',
    padding: 14,
    listRectHeight: 2
  }
}