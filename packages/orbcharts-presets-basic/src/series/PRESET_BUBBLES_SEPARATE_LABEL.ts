import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_BUBBLES_SEPARATE_LABEL: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_BUBBLES_SEPARATE_LABEL',
  description: 'Bubble chart showing label separately',
  descriptionZh: '分開顯示Label的泡泡圖',
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
    },
    // 加長留空
    padding: {
      top: 100,
      right: 100,
      bottom: 100,
      left: 100
    },
  },
  dataFormatter: {
    separateLabel: true,
    container: {
      columnGap: 0,
      rowGap: 0
    }
  },
  pluginParams: {
    Bubbles: {
      force: {
        strength: 0.1,
      }
    },
    SeriesLegend: {
      listRectRadius: 7 // 圓型圖例列點
    },
    SeriesTooltip: {}
  }
}
