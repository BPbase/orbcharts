import type { PresetPartial } from '../../lib/core-types'
import type { PresetGridPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_GRID_PN_SCALE: PresetPartial<'grid', Partial<PresetGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_GRID_PN_SCALE',
  description: 'Positive negative scale',
  descriptionZh: '正負值分向圖',
  chartParams: {
    colors: {
      light: {
        label: [
          "#0088FF",
          "#FF72BB",
          "#16B59B",
          "#F9B052",
          "#6F3BD5",
          "#42C724",
          "#FF3232",
          "#904026",
          "#1F3172",
          "#E23D93"
        ],
      },
      dark: {
        label: [
          "#4BABFF",
          "#FFA0A0",
          "#7DD3C4",
          "#FAC77D",
          "#8454D4",
          "#42C724",
          "#FF6C6C",
          "#D4785A",
          "#5366AC",
          "#FF8DC8"
        ]
      }
    },
    padding: {
      top: 40,
      right: 40,
      bottom: 100,
      left: 80
    },
  },
  dataFormatter: {
    valueAxis: {
      scaleDomain: ['auto', 'auto'],
      scaleRange: [0.05, 0.95],
    },
  },
  pluginParams: {
    GridLegend: {
      placement: 'bottom',
      padding: 14,
    }
  }
}
