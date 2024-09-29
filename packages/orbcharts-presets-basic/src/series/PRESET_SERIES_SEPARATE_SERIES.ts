import type { PresetPartial } from '@orbcharts/core'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'
import { ALL_PLUGIN_PARAMS_SERIES, ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_SERIES_SEPARATE_SERIES: PresetPartial<'series', PresetSeriesPluginParams & PresetNoneDataPluginParams> = {
  name: 'PRESET_SERIES_SEPARATE_SERIES',
  description: '分開顯示Series',
  dataFormatter: {
    separateSeries: true,
  },
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_SERIES,
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
  }
}
