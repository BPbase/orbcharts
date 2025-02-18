import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetBubblesParams, PresetSeriesLegendParams, PresetSeriesTooltipParams, PresetNoneDataPluginParams } from '../types'
// import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_BUBBLES_SCALING_BY_RADIUS: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_BUBBLES_SCALING_BY_RADIUS',
  description: '以半徑尺寸為比例的泡泡圖',
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
    // ...ALL_PLUGIN_PARAMS_NONE_DATA,
    Bubbles: {
      arcScaleType: 'radius'
    },
    SeriesLegend: {
      listRectRadius: 7 // 圓型圖例列點
    },
  },
}
