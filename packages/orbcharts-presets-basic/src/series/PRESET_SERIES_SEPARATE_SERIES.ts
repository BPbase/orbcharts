import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'
// import { ALL_PLUGIN_PARAMS_SERIES, ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_SERIES_SEPARATE_SERIES: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_SERIES_SEPARATE_SERIES',
  description: '分開顯示Series',
  dataFormatter: {
    sort: (a, b) => b.value - a.value,
    separateSeries: true,
  },
  allPluginParams: {
    // ...ALL_PLUGIN_PARAMS_SERIES,
    // ...ALL_PLUGIN_PARAMS_NONE_DATA,
  }
}
PRESET_SERIES_SEPARATE_SERIES.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`