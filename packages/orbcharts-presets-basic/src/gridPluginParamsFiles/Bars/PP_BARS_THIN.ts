import type { PluginParamsFile } from '../../types'
import type { BarsParams } from '@orbcharts/plugins-basic'

export const PP_BARS_THIN: PluginParamsFile<BarsParams> = {
  id: 'PP_BARS_THIN',
  chartType: 'grid',
  pluginName: 'Bars',
  description: '圓角長條圖',
  data: {
    barWidth: 20,
    barPadding: 1,
    barGroupPadding: 10
  }
}
