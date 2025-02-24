import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetBubblesParams, PresetSeriesLegendParams, PresetSeriesTooltipParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_BUBBLES_SCALING_BY_RADIUS: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_BUBBLES_SCALING_BY_RADIUS',
  description: 'Bubble chart scaled by radius size',
  descriptionZh: '以半徑尺寸為比例的泡泡圖',
  chartParams: {
    colors: {
      light: {
        label: [
          "#0088FF",
          "#FF3232",
          "#38BEA8",
          "#6F3BD5",
          "#314285",
          "#42C724",
          "#D52580",
          "#F4721B",
          "#D117EA",
          "#7E7D7D"
        ],
      },
      dark: {
        label: [
          "#4BABFF",
          "#FF6C6C",
          "#7DD3C4",
          "#8E6BC9",
          "#5366AC",
          "#86DC72",
          "#FF72BB",
          "#F9B052",
          "#EF76FF",
          "#C4C4C4"
        ]
      }
    }
  },
  pluginParams: {
    Bubbles: {
      arcScaleType: 'radius'
    },
    SeriesLegend: {
      listRectRadius: 7 // 圓型圖例列點
    },
  },
}
