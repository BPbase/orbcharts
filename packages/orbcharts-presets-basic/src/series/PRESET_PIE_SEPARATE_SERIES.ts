import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'
// import { ALL_PLUGIN_PARAMS_SERIES, ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_PIE_SEPARATE_SERIES: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_PIE_SEPARATE_SERIES',
  description: '分開顯示Series的圓餅圖',
  chartParams: {
    colors: {
      light: {
        label:  [
          "#7DD3C4",
          "#FFA0A0",
          "#6CBAFF",
          "#55D339",
          "#F9B052",
          "#FF6C6C",
          "#8E6BC9",
          "#0088FF",
          "#904026",
          "#C4C4C4"
        ],
      }
    },
  },
  dataFormatter: {
    sort: (a, b) => b.value - a.value,
    separateSeries: true,
  },
  allPluginParams: {
    // ...ALL_PLUGIN_PARAMS_SERIES,
    // ...ALL_PLUGIN_PARAMS_NONE_DATA,
  }
}
PRESET_PIE_SEPARATE_SERIES.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`