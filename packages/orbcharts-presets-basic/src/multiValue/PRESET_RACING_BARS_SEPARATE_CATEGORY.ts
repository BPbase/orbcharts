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
        label: [
          "#0088FF",
          "#16B59B",
          "#6F3BD5",
          "#EE5F13",
          "#F9B052",
          "#D4785A",
          "#42C724",
          "#FF4B4B",
          "#1F3172",
          "#E23D93"
        ],
      },
      dark: {
        label: [
          "#4BABFF",
          "#7DD3C4",
          "#8454D4",
          "#FF6C6C",
          "#FAC77D",
          "#D58C75",
          "#42C724",
          "#FF8B8B",
          "#5366AC",
          "#FF8DC8"
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
      rowGap: 60
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
