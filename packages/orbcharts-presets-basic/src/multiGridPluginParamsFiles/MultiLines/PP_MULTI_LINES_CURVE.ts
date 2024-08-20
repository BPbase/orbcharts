import type { PluginParamsFile } from '../../types'
import type { MultiLinesParams } from '@orbcharts/plugins-basic'

export const PP_MULTI_LINES_CURVE: PluginParamsFile<MultiLinesParams> = {
  id: 'PP_MULTI_LINES_CURVE',
  chartType: 'multiGrid',
  pluginName: 'MultiLines',
  description: '圓弧折線圖',
  data: {
    lineCurve: 'curveMonotoneX',
    lineWidth: 3
  }
}