import type { PluginParamsFile } from '../../types'
import type { RoseLabelsParams } from '@orbcharts/plugins-basic'

export const PP_ROSE_LABELS_SCALING_BY_RADIUS: PluginParamsFile<RoseLabelsParams> = {
  id: 'PP_ROSE_LABELS_SCALING_BY_RADIUS',
  chartType: 'series',
  pluginName: 'RoseLabels',
  description: '以半徑尺寸為比例的玫瑰圖標籤',
  data: {
    arcScaleType: 'radius',
  }
}