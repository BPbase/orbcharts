import type { PresetPartial } from '../../lib/core-types'
import type { PresetMultiValuePluginParams, PresetNoneDataPluginParams } from '../types'
// import { ALL_PLUGIN_PARAMS_GRID, ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_RACING_BARS_SEPARATE_CATEGORY: PresetPartial<'multiValue', Partial<PresetMultiValuePluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_RACING_BARS_SEPARATE_CATEGORY',
  description: '分開顯示category的賽跑長條圖',
  chartParams: {
    colors: {
      light: {
        label:  [
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
      top: 60,
      right: 20,
      bottom: 100,
      left: 80
    },
    transitionDuration: 500
  },
  dataFormatter: {
    separateCategory: true
  },
  allPluginParams: {
    RacingBars: {
      barLabel: {
        position: 'outside',
        colorType: 'primary',
        padding: 10
      },
      valueLabel: {
        padding: 10
      },
      autorun: true,
    },
    RacingValueAxis: {
      ticks: 3,
    },
    MultiValueLegend: {
      placement: 'bottom',
      padding: 14,
    }
  }
}
