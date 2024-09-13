import type { PluginParamsFile } from '../../types'
import type { RoseParams } from '@orbcharts/plugins-basic'

export const PP_ROSE_SCALING_BY_RADIUS: PluginParamsFile<RoseParams> = {
  id: 'PP_ROSE_SCALING_BY_RADIUS',
  chartType: 'series',
  pluginName: 'Rose',
  description: '以半徑尺寸為比例的玫瑰圖',
  data: {
    arcScaleType: 'radius'
  }
}