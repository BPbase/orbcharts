import type { PluginParamsFile } from '../../types'
import type { PieLabelsParams } from '@orbcharts/plugins-basic'

export const PP_PIE_LABELS_INNER: PluginParamsFile<PieLabelsParams> = {
  id: 'PP_PIE_LABELS_INNER',
  chartType: 'series',
  pluginName: 'PieLabels',
  description: '圖內資料標籤',
  data: {
    "labelCentroid": 1.3,
    "labelColorType": "primary"
  }
}
