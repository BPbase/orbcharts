import type { PresetPartial } from '../../lib/core-types'
import type { PresetPieParams, PresetPieLabelsParams, PresetPieEventTextsParams, PresetSeriesLegendParams, PresetNoneDataPluginParams } from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_PIE_DONUT: PresetPartial<'series', PresetPieParams
& PresetPieLabelsParams
& PresetPieEventTextsParams
& PresetSeriesLegendParams
& PresetNoneDataPluginParams> = {
  name: 'PRESET_PIE_DONUT',
  description: '甜甜圈圖',
  dataFormatter: {
    sort: (a, b) => b.value - a.value
  },
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
    Pie: {
      innerRadius: 0.5
    },
    PieLabels: {},
    PieEventTexts: {},
    SeriesLegend: {
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}
PRESET_PIE_DONUT.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`