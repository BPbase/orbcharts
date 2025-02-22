import type { PresetPartial } from '../../lib/core-types'
import type { PresetMultiValuePluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_RACING_BARS_SEPARATE_CATEGORY: PresetPartial<'multiValue', Partial<PresetMultiValuePluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_RACING_BARS_SEPARATE_CATEGORY',
  description: 'Racing bars with separate category',
  descriptionZh: '分開顯示category的賽跑長條圖',
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
      },
      dark: {
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
        ]
      }
    },
    padding: {
      top: 40,
      right: 40,
      bottom: 60,
      left: 140
    },
    transitionDuration: 500
  },
  dataFormatter: {
    separateCategory: true,
    container: {
      gap:80
    },
  },
  pluginParams: {
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
