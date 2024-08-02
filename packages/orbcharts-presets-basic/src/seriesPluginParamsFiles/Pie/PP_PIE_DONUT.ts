import type { PluginParamsFile } from '../../types'
import type { PieParams } from '@orbcharts/plugins-basic'

export const PP_PIE_DONUT: PluginParamsFile<PieParams> = {
  id: 'PP_PIE_DONUT',
  chartType: 'series',
  pluginName: 'Pie',
  description: '甜甜圈圖',
  data: {
    innerRadius: 0.5
  }
}
