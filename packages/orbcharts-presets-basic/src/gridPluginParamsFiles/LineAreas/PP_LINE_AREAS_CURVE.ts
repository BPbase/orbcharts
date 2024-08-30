import type { PluginParamsFile } from '../../types'
import type { LineAreasParams } from '@orbcharts/plugins-basic'

export const PP_LINE_AREAS_CURVE: PluginParamsFile<LineAreasParams> = {
  id: 'PP_LINE_AREAS_CURVE',
  chartType: 'grid',
  pluginName: 'LineAreas',
  description: '圓弧折線圖',
  data: {
    lineCurve: 'curveMonotoneX',
  }
}