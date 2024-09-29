import type { PresetPartial } from '@orbcharts/core'
import type { PresetPieParams, PresetPieLabelsParams, PresetPieEventTextsParams, PresetSeriesLegendParams, PresetNoneDataPluginParams } from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_PIE_WITH_INNER_LABELS: PresetPartial<'series', PresetPieParams
& PresetPieLabelsParams
& PresetPieEventTextsParams
& PresetSeriesLegendParams
& PresetNoneDataPluginParams> = {
  name: 'PRESET_PIE_WITH_INNER_LABELS',
  description: '圓餅圖及內部資料標籤',
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
    Pie: {},
    PieLabels: {
      "labelCentroid": 1.3, // 圖內資料標籤
      "labelColorType": "primary"
    },
    PieEventTexts: {},
    SeriesLegend: {
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}
