import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'
// import { ALL_PLUGIN_PARAMS_SERIES, ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_SERIES_BASIC: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_SERIES_BASIC',
  description: '基本Series參數',
  allPluginParams: {
    // ...ALL_PLUGIN_PARAMS_SERIES,
    // ...ALL_PLUGIN_PARAMS_NONE_DATA,
    SeriesLegend: {
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}
