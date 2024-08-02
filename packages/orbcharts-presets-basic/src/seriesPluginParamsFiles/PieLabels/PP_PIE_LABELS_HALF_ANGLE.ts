import type { PluginParamsFile } from '../../types'
import type { PieLabelsParams } from '@orbcharts/plugins-basic'

export const PP_PIE_LABELS_HALF_ANGLE: PluginParamsFile<PieLabelsParams> = {
  id: 'PP_PIE_LABELS_HALF_ANGLE',
  chartType: 'series',
  pluginName: 'PieLabels',
  description: '半圓甜甜圈資料標籤',
  data: {
    startAngle: - Math.PI / 2,
    endAngle: Math.PI / 2,
  }
}
