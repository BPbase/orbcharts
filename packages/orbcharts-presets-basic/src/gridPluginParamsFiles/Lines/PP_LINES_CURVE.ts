import type { PluginParamsFile } from '../../types'
import type { LinesParams } from '@orbcharts/plugins-basic'

export const PP_LINES_CURVE: PluginParamsFile<LinesParams> = {
  id: 'PP_LINES_CURVE',
  chartType: 'grid',
  pluginName: 'Lines',
  description: '圓弧折線圖',
  data: {
    lineCurve: 'curveMonotoneX',
    lineWidth: 3
  }
}