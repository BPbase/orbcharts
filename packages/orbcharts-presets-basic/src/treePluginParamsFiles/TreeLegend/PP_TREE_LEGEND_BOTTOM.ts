import type { PluginParamsFile } from '../../types'
import type { TreeLegendParams } from '@orbcharts/plugins-basic'

export const PP_TREE_LEGEND_BOTTOM: PluginParamsFile<TreeLegendParams> = {
  id: 'PP_TREE_LEGEND_BOTTOM',
  chartType: 'tree',
  pluginName: 'TreeLegend',
  description: '底部圖例',
  data: {
    position: 'bottom',
    justify: 'center',
    padding: 14,
  }
}