import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetSeriesTooltipParams, PresetNoneDataPluginParams } from '../types'
// import { ALL_PLUGIN_PARAMS_SERIES, ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_PIE_BASIC: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_PIE_BASIC',
  description: '基本Pie參數',
  dataFormatter: {
    sort: (a, b) => b.value - a.value
  },
  allPluginParams: {
    // ...ALL_PLUGIN_PARAMS_NONE_DATA,
    SeriesLegend: {
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}
PRESET_PIE_BASIC.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`