import type { PresetPartial } from '@orbcharts/core'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'
import { ALL_PLUGIN_PARAMS_SERIES, ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_SERIES_SEPARATE_SERIES_AND_SUM_SERIES: PresetPartial<'series', PresetSeriesPluginParams & PresetNoneDataPluginParams> = {
  name: 'PRESET_SERIES_SEPARATE_SERIES_AND_SUM_SERIES',
  description: '分開顯示Series並合併Series資料',
  dataFormatter: {
    separateSeries: true,
    sumSeries: true,
  },
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_SERIES,
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
  }
}
