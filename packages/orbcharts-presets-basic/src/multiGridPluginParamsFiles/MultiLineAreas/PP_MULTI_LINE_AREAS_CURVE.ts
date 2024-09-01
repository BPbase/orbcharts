import type { PluginParamsFile } from '../../types'
import type { MultiLineAreasParams } from '@orbcharts/plugins-basic'

export const PP_MULTI_LINE_AREAS_CURVE: PluginParamsFile<MultiLineAreasParams> = {
  id: 'PP_MULTI_LINE_AREAS_CURVE',
  chartType: 'multiGrid',
  pluginName: 'MultiLineAreas',
  description: '圓弧折線圖',
  data: {
    lineCurve: 'curveMonotoneX',
  }
}