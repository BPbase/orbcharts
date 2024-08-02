import type { PluginParamsFile } from '../../types'
import type { PieParams } from '@orbcharts/plugins-basic'

export const PP_PIE_HALF_DONUT: PluginParamsFile<PieParams> = {
  id: 'PP_PIE_HALF_DONUT',
  chartType: 'series',
  pluginName: 'Pie',
  description: '半圓甜甜圈圖',
  data: {
    innerRadius: 0.5,
    startAngle: - Math.PI / 2,
    endAngle: Math.PI / 2,
  }
}
