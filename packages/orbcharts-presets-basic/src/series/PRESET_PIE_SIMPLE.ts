import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetSeriesTooltipParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_PIE_SIMPLE: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_PIE_SIMPLE',
  description: 'Simple pie chart',
  descriptionZh: '簡單圓餅圖',
  chartParams: {
    padding: {
      top: 30,
      right: 30,
      bottom: 30,
      left: 30
    },
    colors: {
      light: {
        label: [
          "#0088FF",
          "#4BABFF",
          "#38BEA8",
          "#86DC72",
          "#F9B052",
          "#F4721B",
          "#FF3232",
          "#5F2714",
          "#D117EA",
          "7E7D7D"
        ],
      },
      dark: {
        label: [
          "#4BABFF",
          "#8BC8FF",
          "#61CBB9",
          "#ACE1A0",
          "#FCDCAD",
          "#F9B052",
          "#FF6C6C",
          "#904026",
          "#EF76FF",
          "#C4C4C4"
        ]
      }
    }
  },
  dataFormatter: {
    sort: (a, b) => b.value - a.value
  },
  pluginParams: {
    SeriesLegend: {
      listRectRadius: 7, // 圓型圖例列點
      padding: 7
    }
  }
}
PRESET_PIE_SIMPLE.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`