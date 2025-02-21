import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_SERIES_SUM_SERIES: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_SERIES_SUM_SERIES',
  description: 'Combine Series data',
  descriptionZh: '合併Series資料',
  dataFormatter: {
    sort: (a, b) => b.value - a.value,
    sumSeries: true
  },
  pluginParams: {

  }
}
PRESET_SERIES_SUM_SERIES.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`
