import type { PluginParamsFile } from '../../types'
import type { DotsParams } from '@orbcharts/plugins-basic'

export const PP_DOTS_SOLID: PluginParamsFile<DotsParams> = {
  id: 'PP_DOTS_SOLID',
  chartType: 'grid',
  pluginName: 'Dots',
  description: '實心圓點',
  data: {
    radius: 3,
    fillColorType: 'series',
    onlyShowHighlighted: false
  }
}
