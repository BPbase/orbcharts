import type { PresetPartial } from '@orbcharts/core'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'
import { ALL_PLUGIN_PARAMS_SERIES, ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_SERIES_DESC: PresetPartial<'series', PresetSeriesPluginParams & PresetNoneDataPluginParams> = {
  name: 'PRESET_SERIES_DESC',
  description: '資料由大到小排序',
  dataFormatter: {
    sort: (a, b) => b.value - a.value
  },
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_SERIES,
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
  }
}
PRESET_SERIES_DESC.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`