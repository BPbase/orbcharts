import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_BUBBLES_SEPARATE_SERIES: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_BUBBLES_SEPARATE_SERIES',
  description: 'Bubble chart showing series separately',
  descriptionZh: '分開顯示Series的泡泡圖',
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
    },
    // 加長留空
    padding: {
      top: 160,
      right: 160,
      bottom: 160,
      left: 160
    },
  },
  dataFormatter: {
    separateSeries: true,
  },
  allPluginParams: {
    Bubbles: {},
    SeriesLegend: {
      listRectRadius: 7 // 圓型圖例列點
    },
    SeriesTooltip: {}
  }
}
