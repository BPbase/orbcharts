import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_SERIES_SEPARATE_SERIES: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_SERIES_SEPARATE_SERIES',
  description: 'Separate Series',
  descriptionZh: '分開顯示Series',
  dataFormatter: {
    sort: (a, b) => b.value - a.value,
    separateSeries: true,
  },
  allPluginParams: {
  }
}
PRESET_SERIES_SEPARATE_SERIES.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`