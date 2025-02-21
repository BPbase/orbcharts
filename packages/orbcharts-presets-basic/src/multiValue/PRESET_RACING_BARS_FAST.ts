import type { PresetPartial } from '../../lib/core-types'
import type { PresetMultiValuePluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_RACING_BARS_FAST: PresetPartial<'multiValue', Partial<PresetMultiValuePluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_RACING_BARS_FAST',
  description: 'Fast Racing Bars',
  descriptionZh: '快速的賽跑長條圖',
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
      right: 60,
      bottom: 100,
      left: 60
    },
    transitionDuration: 250
  },
  allPluginParams: {
    RacingBars: {
      autorun: true,
    },
    MultiValueLegend: {
      placement: 'bottom',
      padding: 14,
    }
  }
}
