import type { PresetPartial } from '../../lib/core-types'
import type { PresetGridPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_GRID_PN_SCALE_SIMPLE: PresetPartial<'grid', Partial<PresetGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_GRID_PN_SCALE_SIMPLE',
  description: 'Simple positive negative scale',
  descriptionZh: '簡單正負值分向圖',
  chartParams: {
    colors: {
      light: {
        label: [
          "#4BABFF",
          "#FFA0A0",
          "#7DD3C4",
          "#F9B052",
          "#8454D4",
          "#42C724",
          "#FF4B4B",
          "#904026",
          "#4B25B3",
          "#C50669"
        ],
      }
    },
    padding: {
      top: 40,
      right: 40,
      bottom: 80,
      left: 40
    },
  },
  dataFormatter: {
    valueAxis: {
      scaleDomain: ['auto', 'auto'],
      scaleRange: [0.05, 0.95],
    },
  },
  allPluginParams: {
    // ...ALL_PLUGIN_PARAMS_GRID,
    // ...ALL_PLUGIN_PARAMS_NONE_DATA,
    GridLegend: {
      // position: 'bottom',
      // justify: 'center',
      placement: 'bottom',
      padding: 7,
    }
  }
}
