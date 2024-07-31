import type { PluginParamsFile } from '../../types'
import type { BarsPluginParams } from '@orbcharts/plugins-basic'

export const BARS_ROUND_PLUGIN_PARAMS: PluginParamsFile<BarsPluginParams> = {
  id: 'BARS_ROUND_PLUGIN_PARAMS',
  chartType: 'series',
  pluginName: 'Bars',
  description: '圓角長條圖',
  data: {
    barRadius: 5
  }
}