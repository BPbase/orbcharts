import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_SERIES_SEPARATE_SERIES_AND_SUM_SERIES: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_SERIES_SEPARATE_SERIES_AND_SUM_SERIES',
  description: 'Separate and sum Series data',
  descriptionZh: '分開顯示Series並合併Series資料',
  dataFormatter: {
    sort: (a, b) => b.value - a.value,
    separateSeries: true,
    sumSeries: true,
  },
  pluginParams: {
  }
}
PRESET_SERIES_SEPARATE_SERIES_AND_SUM_SERIES.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`