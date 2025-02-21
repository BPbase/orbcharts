import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_BUBBLES_SUM_SERIES: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_BUBBLES_SUM_SERIES',
  description: 'Bubble chart of combined Series data',
  descriptionZh: '合併Series資料的泡泡圖',
  chartParams: {
    colors: {
      light: {
        label: [
          "#6CBAFF",
          "#FF6C6C",
          "#F9B052",
          "#7DD3C4",
          "#AA93D2",
          "#0088FF",
          "#FFBABA",
          "#86DC72",
          "#EF76FF",
          "#C4C4C4"
        ],
      }
    }
  },
  dataFormatter: {
    sort: (a, b) => b.value - a.value,
    sumSeries: true
  },
  pluginParams: {
  }
}
PRESET_BUBBLES_SUM_SERIES.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`
