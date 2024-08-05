import type { PluginParamsFile } from '../../types'
import type { DotsParams } from '@orbcharts/plugins-basic'

export const PP_DOTS_ONLY_SHOW_HIGHLIGHTED: PluginParamsFile<DotsParams> = {
  id: 'PP_DOTS_ONLY_SHOW_HIGHLIGHTED',
  chartType: 'grid',
  pluginName: 'Dots',
  description: '顯示highlight圓點',
  data: {
    onlyShowHighlighted: false
  }
}
