import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'
// import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_PIE_WITH_INNER_LABELS: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_PIE_WITH_INNER_LABELS',
  description: '圓餅圖及內部資料標籤',
  dataFormatter: {
    sort: (a, b) => b.value - a.value
  },
  allPluginParams: {
    // ...ALL_PLUGIN_PARAMS_NONE_DATA,
    Pie: {},
    PieLabels: {
      "labelCentroid": 1.3, // 圖內資料標籤
      "labelColorType": "labelContrast"
    },
    PieEventTexts: {},
    SeriesLegend: {
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}
PRESET_PIE_WITH_INNER_LABELS.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`