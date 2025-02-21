import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_BUBBLES_BASIC: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_BUBBLES_BASIC',
  description: 'Basic bubble chart',
  descriptionZh: '基本泡泡圖',
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
  allPluginParams: {
    SeriesLegend: {
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}
