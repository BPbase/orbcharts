import type { PresetPartial } from '@orbcharts/core'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'
import { ALL_PLUGIN_PARAMS_SERIES, ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_SERIES_SUM_SERIES: PresetPartial<'series', PresetSeriesPluginParams & PresetNoneDataPluginParams> = {
  name: 'PRESET_SERIES_SUM_SERIES',
  description: '合併Series資料',
  dataFormatter: {
    sort: (a, b) => b.value - a.value,
    sumSeries: true
  },
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_SERIES,
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
  }
}
PRESET_SERIES_SUM_SERIES.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`
