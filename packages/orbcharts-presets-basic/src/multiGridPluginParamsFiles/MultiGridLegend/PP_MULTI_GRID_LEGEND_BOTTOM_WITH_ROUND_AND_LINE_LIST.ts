import type { PluginParamsFile } from '../../types'
import type { MultiGridLegendParams } from '@orbcharts/plugins-basic'

export const PP_MULTI_GRID_LEGEND_BOTTOM_WITH_ROUND_AND_LINE_LIST: PluginParamsFile<MultiGridLegendParams> = {
  id: 'PP_MULTI_GRID_LEGEND_BOTTOM_WITH_ROUND_AND_LINE_LIST',
  chartType: 'multiGrid',
  pluginName: 'MultiGridLegend',
  description: '底部圖例圓型及線條列點',
  data: {
    position: 'bottom',
    justify: 'center',
    padding: 14,
    gridList: [
      {
        listRectRadius: 7,
      },
      {
        listRectHeight: 2,
      }
    ]
  }
}