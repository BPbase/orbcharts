import type { PluginParamsFile } from '../../types'
import type { BubblesParams } from '@orbcharts/plugins-basic'

export const PP_BUBBLES_SCALING_BY_RADIUS: PluginParamsFile<BubblesParams> = {
  id: 'PP_BUBBLES_SCALING_BY_RADIUS',
  chartType: 'series',
  pluginName: 'Bubbles',
  description: '以半徑尺寸為比例的泡泡圖',
  data: {
    bubbleScaleType: 'radius'
  }
}