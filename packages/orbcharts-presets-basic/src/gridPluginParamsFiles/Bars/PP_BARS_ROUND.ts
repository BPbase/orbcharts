import type { PluginParamsFile } from '../../types'
import type { BarsParams } from '@orbcharts/plugins-basic'

export const PP_BARS_ROUND: PluginParamsFile<BarsParams> = {
  id: 'PP_BARS_ROUND',
  chartType: 'grid',
  pluginName: 'Bars',
  description: '圓角長條圖',
  data: {
    barWidth: 0,
    barPadding: 1,
    barGroupPadding: 10,
    barRadius: true,
  }
}