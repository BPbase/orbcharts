import type { PresetPartial } from '../../lib/core-types'
import type { PresetMultiValuePluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_RACING_BARS_OUTSIDE_LABELS: PresetPartial<'multiValue', Partial<PresetMultiValuePluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_RACING_BARS_OUTSIDE_LABELS',
  description: 'Racing bars with labels outside',
  descriptionZh: '標籤在外面的賽跑長條圖',
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
      top: 60,
      right: 60,
      bottom: 100,
      left: 160
    },
    transitionDuration: 500
  },
  pluginParams: {
    RacingBars: {
      barLabel: {
        position: 'outside',
        colorType: 'primary'
      },
      autorun: true,
    },
    MultiValueLegend: {
      placement: 'bottom',
      padding: 14,
    }
  }
}
