import type { PluginParamsFile } from '../../types'
import type { MultiBarsParams } from '@orbcharts/plugins-basic'

export const PP_MULTI_BARS_ROUND: PluginParamsFile<MultiBarsParams> = {
  id: 'PP_MULTI_BARS_ROUND',
  chartType: 'multiGrid',
  pluginName: 'MultiBars',
  description: '圓角長條圖',
  data: {
    barWidth: 0,
    barPadding: 1,
    barGroupPadding: 10,
    barRadius: true,
  }
}