import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_PIE_SEPARATE_SERIES: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_PIE_SEPARATE_SERIES',
  description: 'Separate pie chart of Series',
  descriptionZh: '分開顯示Series的圓餅圖',
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
  pluginParams: {
  }
}
PRESET_PIE_SEPARATE_SERIES.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`